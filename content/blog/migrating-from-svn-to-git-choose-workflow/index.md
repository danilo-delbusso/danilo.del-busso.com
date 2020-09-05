---
title: 'Migrating From SVN to Git: Choose Your First Workflow'
description: 'Understand the two simplest Git workflows to help choose how to migrate your team from SVN.'
date: '2020-09-05'
tags: 'git_svn_git-workflow_version-control_team-management_team-productivity_beginners-guide'
---
![](https://raw.githubusercontent.com/danilo-delbusso/danilo-delbusso.me/master/content/blog/migrating-from-svn-to-git-choose-workflow/cover.jpg)

While you might think of [SVN](https://subversion.apache.org/) as an anachronistic tool relegated to the bin of dead software that we once loved, small teams and big corporations are yet to make the jump to newer VCSs like [Git](https://git-scm.com/).

When migrating to Git, it is important to think of what your team needs. Choosing a workflow is a crucial part of that process, so I will be comparing briefly the two simplest Git workflows to help you conceptualise the very basic differences between SVN and Git’s approaches to keep track of your work in a team.

![](https://github.com/danilo-delbusso/danilo-delbusso.me/blob/master/content/blog/migrating-from-svn-to-git-choose-workflow/svn_vs_git_stack_overflow.png?raw=true)


*The death of SVN shown as a percentage of Stack Overflow questions per month between Git and SVN*

To follow along, you will need some basic understanding of how Git works.

## Centralised Workflow

The Centralized Workflow uses a central repository to serve as the single point-of-entry for all changes to the project.

This workflow is the closest to SVN and might be easier for teams who are just getting started. However, if you are moving to Git with the goal of taking advantage of more complex, flexible workflows, this option might look very limiting.

### How it works

Developers push their changes directly to the central repository, on the ***master*** branch.
If there are changes that have not been pulled from the central repository, Git will refuse the request like so:

![](https://raw.githubusercontent.com/danilo-delbusso/danilo-delbusso.me/master/content/blog/migrating-from-svn-to-git-choose-workflow/refuse-master-push.png)

The developer must pull from ***master*** before being able to push their changes.

### Best Practice for pulling: --rebase

It is best practice in the Centralised Workflow model to pull using the rebase flag, like so:

```bash
git pull --rebase origin master
```

The --rebase flag tells Git to move all of the new commits to the tip of the ***master*** branch after synchronising it with the changes from the central repository, as shown below:

![](https://raw.githubusercontent.com/danilo-delbusso/danilo-delbusso.me/master/content/blog/migrating-from-svn-to-git-choose-workflow/rebase-flag-diagram.png)

Without --rebase the pull would still work but it’ll add a superfluous merge commit.

--rebase also allows the developer to pull the commits from ***master*** one at a time, which allows solving conflicts in smaller chunks.

In order to move forward with --rebase, use:

```bash
git rebase --continue
```

In order to abort the entire --rebase, use:

```bash
git rebase --abort
```

## Feature Branch Workflow

Git allows team members to easily keep their work isolated until features are fully implemented and tested.

The simplest implementation of this design is the feature branch workflow, in which feature development takes place in a separate branch.

![](https://github.com/danilo-delbusso/danilo-delbusso.me/blob/master/content/blog/migrating-from-svn-to-git-choose-workflow/branch.png?raw=true)

### How it works

Developers create a new branch for every feature that needs to be developed.

### Create a branch

After [creating a new branch](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging), the developer can start working on them from local using the following command:

```bash
git checkout --track origin/BRANCH-NAME
```

### Make changes
The developer now works on their branch and stages, commits, and pushes only to the feature branch, not the ***master***.

### Pull requests and peer reviews on VCS platforms

Once the feature has been developed, the developer can create a pull request. This feature is usually available on websites such as [GitHub](https://www.github.com) or [BitBucket](https://www.bitbucket.org/).

The developer can ask other team users as reviewers in order to double-check and test the changes before they are merged to the ***master*** branch.

The reviewers can reject the pull request and ask for changes to be made.
Once the feature is ready, the pull request can be accepted, and the branch merged with the ***master*** branch.

In the following example, we see how two branches are created at the same time (***feature/add-test.html*** and ***update/update-readme-file***).
The two developers work at the same time on their feature, create separate pull requests, and merge them.

![](https://raw.githubusercontent.com/danilo-delbusso/danilo-delbusso.me/master/content/blog/migrating-from-svn-to-git-choose-workflow/branches.png)

### Best Practices
The ***master*** branch is sacrosanct and pushing and merging to it should not be taken lightly.

It is good practice to delete the feature branch once it has been merged with the ***master*** branch as it is not needed anymore.