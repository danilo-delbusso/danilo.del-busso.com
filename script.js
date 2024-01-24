//#region Node Class
class Node {
    constructor(name, date = null, isFile = false) {
        this.name = name
        this.date = date
        this.isFile = isFile
        this.children = []
    }

    addChild(childNode) {
        this.children.push(childNode)
        childNode.parent = this
    }

    addChildren(...children) {
        this.children.push(...children)
        children.forEach((c) => (c.parent = this))
    }

    getFiles() {
        return this.children.filter((c) => c.isFile)
    }

    getFolders() {
        return this.children.filter((c) => !c.isFile)
    }

    getChildren() {
        return this.children ?? []
    }
}

//#endregion

//#region Files and Folders definitions

const root = new Node('~')

const paths = new Node('paths')
paths.addChildren(
    new Node('italy-immuni.md', '2020-06-17', true),
    new Node('mvvm.md', '2020-07-03', true),
    new Node('dragonboard.md', '2019-04-24', true)
)

root.addChildren(
    new Node('about.md', '', true),
    new Node('experience.md', '', true),
    paths
)

//#endregion

const validCommands = ['cat', 'ls', 'll', 'cd', 'clear', 'help']
let currentLocation = root

//#region UI Helpers
function createFileElement(file) {
    const itemContainer = document.createElement('div')
    itemContainer.addEventListener('click', () => handleOpenFile(file))

    itemContainer.classList.add('file-item')
    const fileName = document.createElement('span')
    fileName.classList.add('file-name')
    fileName.innerText = file.name
    itemContainer.appendChild(fileName)

    if (file.date) {
        const fileDate = document.createElement('span')
        fileDate.classList.add('file-date')
        fileDate.innerText = file.date
        itemContainer.appendChild(fileDate)
    }
    return itemContainer
}

function createFolderElement(folder) {
    const itemContainer = document.createElement('div')
    itemContainer.classList.add('folder-item')
    const folderName = document.createElement('span')
    folderName.addEventListener('click', () => handleOpenFolder(folder))

    folderName.classList.add('folder-name')
    folderName.innerText = folder.name + '/'
    itemContainer.appendChild(folderName)
    return itemContainer
}

//#endregion

function handleOpenFile(file) {
    handleCommand(`cat ${file.name}`)
    updateURL(file)
}

function handleOpenFolder(folder) {
    handleCommand(`cd ${folder.name}`)
    handleCommand('ls')
    updateURL(folder)
}

function goBack() {
    handleCommand('cd ..')
}

function listFiles() {
    handleCommand('ls')
}

function showError(error) {
    const terminalOutputElement = document.getElementById('terminal-output')
    terminalOutputElement.innerHTML = `<span class="error">Error: ${error}</span>`
}

function showUserInput(input) {
    const inputElement = document.getElementById('input')
    const currentFolderElement = document.getElementById('current-folder')

    inputElement.innerText = input ?? ''
    currentFolderElement.innerText = currentLocation.name
}

function handleCommand(command) {
    const terminalOutputElement = document.getElementById('terminal-output')
    const fileOutputElement = document.getElementById('file-output')
    const backButtonElement = document.getElementById('back-button')

    terminalOutputElement.innerHTML = ''
    fileOutputElement.innerHTML = ''

    if (command === 'help') {
        terminalOutputElement.innerHTML = `You can use any of these commands: ${validCommands
            .map((c) => `<span class="command">${c}</span>`)
            .join(', ')}`
    } else if (command === 'clear') {
        showUserInput()
    } else if (command === 'ls' || command === 'll') {
        const contentContainer = document.createElement('div')

        if (currentLocation.parent) {
            contentContainer.appendChild(createFolderElement(new Node('..')))
        }

        currentLocation.children.forEach((child) => {
            contentContainer.appendChild(
                child.isFile
                    ? createFileElement(child)
                    : createFolderElement(child)
            )
        })

        terminalOutputElement.appendChild(contentContainer)
    } else if (command?.startsWith('cd ') || command?.trim() === 'cd') {
        let folder = command.slice(3)
        if (folder === '..' && currentLocation !== root) {
            currentLocation = currentLocation.parent
        } else if (folder === '') {
            currentLocation = root
        } else {
            const match = currentLocation
                .getFolders()
                .find((e) => e.name === folder)
            if (match) {
                currentLocation = match
            } else {
                showError('Could not find folder')
            }
        }

        if (
            currentLocation === root &&
            !backButtonElement.classList.contains('disabled')
        ) {
            backButtonElement.classList.add('disabled')
        } else if (
            currentLocation !== root &&
            backButtonElement.classList.contains('disabled')
        ) {
            backButtonElement.classList.remove('disabled')
        }
    } else if (command?.startsWith('cat ')) {
        const file = command.slice(4)

        if (currentLocation.getChildren().find((f) => f.name === file)) {
            fetch(file)
                .then((res) => {
                    if (res.status !== 200) {
                        showError(
                            'There was an error trying to fetch this file'
                        )
                        handleCommand('ls')
                        return ''
                    }

                    return res.text()
                })
                .then((text) => {
                    fileOutputElement.innerHTML = marked.parse(text)
                })
                .catch((e) =>
                    showError(
                        `There was an error trying to fetch this file.\n${e}`
                    )
                )
        } else {
            showError('Could not find file')
        }
    } else {
        showError('Command not supported')
    }

    showUserInput()
}

//#region URL stuff

function getPathFromNode(node) {
    if (node === root || !node) {
        return ''
    }

    const parentPath = getPathFromNode(node.parent)
    return `${parentPath}/${node.name}`
}

function updateURL(node = currentLocation) {
    const hash = getCurrentHash(node)
    window.location.hash = hash
}

function getCurrentHash(node) {
    const path = getPathFromNode(node)
    return `#${path}`
}

function restoreFileFromHash(hash) {
    const path = hash.substring(1) // Remove the '#' character
    const pathSegments = path.split('/').filter((segment) => segment !== '')

    let currentNode = root

    for (const segment of pathSegments) {
        const match = currentNode
            .getChildren()
            .find((child) => child.name === segment && !child.isFile)

        if (match) {
            currentNode = match
        }
    }

    currentLocation = currentNode

    const fileName = pathSegments[pathSegments.length - 1]
    const fileNode = currentNode
        .getChildren()
        .find((child) => child.name === fileName && child.isFile)

    if (fileNode) {
        // Restore the correct file
        handleCommand(`cat ${fileName}`)
    } else {
        handleCommand('ls')
    }
}

//#endregion

document.addEventListener('DOMContentLoaded', function () {
    const terminalOutputElement = document.getElementById('terminal-output')
    const inputElement = document.getElementById('input')

    function autoComplete(partiallyTypedWord, validWords = validCommands) {
        const split = partiallyTypedWord.split(' ')
        const inputWord = split[split.length - 1]?.toLowerCase()

        const matches = []
        for (const word of validWords) {
            const lowerCaseWord = word.toLowerCase()
            if (lowerCaseWord.startsWith(inputWord)) {
                matches.push(word)
            }
        }

        if (matches.length !== 1) {
            return null
        }

        return split.length > 1
            ? [...split.slice(0, -1), matches[0]].join(' ')
            : matches[0]
    }

    //#region Modify UI
    document.addEventListener('keydown', function (event) {
        let userInputText = inputElement.innerText
            ?.trimStart()
            .toLowerCase()
            .replace(/[^a-zA-Z0-9_\s\p{P}]/giu, '')

        if (event.key === 'Enter') {
            handleCommand(userInputText)
        } else if (event.key === 'Backspace') {
            showUserInput(userInputText.slice(0, -1))
        } else if (event.key === 'Tab') {
            event.preventDefault()
            const found = autoComplete(
                userInputText,
                validCommands.concat(
                    currentLocation.getChildren().map((c) => c.name)
                )
            )

            if (found) {
                showUserInput(found)
            }
        } else if (!event.altKey && !event.shiftKey && !event.ctrlKey) {
            const key = event.key.length > 1 ? '' : event.key
            key.replace(/[^a-zA-Z0-9\s\p{P}]/gu, '')

            showUserInput(`${userInputText}${key}`)
        }

        terminalOutputElement.scrollTop = terminalOutputElement.scrollHeight
    })

    //#endregion

    // start by calling ls

    restoreFileFromHash(window.location.hash)
})
