import React from "react"
import SEO from "../components/seo"
import indexStyles from "../css/index.module.css"
import Mutating from "../components/mutating"
import Layout from "../components/layout"
import { graphql, navigate } from "gatsby"
import { IconContext } from "react-icons"
import { FaChevronDown } from "react-icons/fa"
import Image from "gatsby-image"
import Social from "../components/social"

const getRandomDescription = descriptions => {
  return descriptions[Math.floor(Math.random() * descriptions.length)]
}

const HEADER_HEIGHT = 55

const scrollTo = ref =>
  window.scrollTo(0, ref.current.offsetTop - HEADER_HEIGHT)

const ContactForm = () => {
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [message, setMessage] = React.useState("")

  const sendToFormHandler = () => {
    return fetch("https://submit-form.com/Sx7w1xSNbKzGrx5ieV7O2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await sendToFormHandler()
      navigate("/form-submitted/")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <form className={indexStyles.contactForm} onSubmit={handleSubmit}>
        <div>
          <label>
            Name
            <br />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Email
            <br />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </label>
        </div>
        <label>
          Message
          <br />
          <textarea
            value={message}
            rows={6}
            onChange={e => setMessage(e.target.value)}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </>
  )
}

const BlogIndex = ({ data }) => {
  const author = data.site.siteMetadata.author
  const description = getRandomDescription(author.descriptions)

  const descriptionRef = React.useRef()
  const scrollToDescription = () => scrollTo(descriptionRef)

  return (
    <Layout>
      <SEO />
      <div className={indexStyles.hero}>
        <div className="container">
          <div className={indexStyles.heroText}>
            <h1>
              Hi, I'm{` `}
              <span className={indexStyles.name}>{author.firstName}</span>
            </h1>
            <Mutating text={description} />
          </div>
        </div>

        <IconContext.Provider value={{ color: "#649d66" }}>
          <div className={indexStyles.down}>
            <button onClick={scrollToDescription}>
              <FaChevronDown />
            </button>
          </div>
        </IconContext.Provider>
      </div>

      <section
        ref={descriptionRef}
        className={`container ${indexStyles.aboutMeSection}`}
      >
        <h2>About Me</h2>
        <div className={indexStyles.aboutMe}>
          <Image
            fixed={data.avatar.childImageSharp.fixed}
            alt={author.name}
            style={{
              float: "left",
              borderRadius: "50%",
              margin: "10px 30px 5px",
            }}
          />
          <p>
            Hi! My name is {author.name}. I'm a software engineer
            from Italy <img height="17" alt="italy flag" src="https://raw.githubusercontent.com/danilo-delbusso/danilo.del-busso.com/36178a67861056684145e11b2606a51728248210/content/assets/it.svg" />, currently working in the UK <img height="17" alt="uk flag" src="https://raw.githubusercontent.com/danilo-delbusso/danilo-delbusso.me/36178a67861056684145e11b2606a51728248210/content/assets/uk.svg" /> at <a href='https://www.xenserver.com'>XenServer</a> and as a self-employed <a href='https://reactjs.org'>React</a> developer.
          </p>
          <p>
            I am <a href='https://github.com/xenserver'>XenServer</a> developer, working on <a href='https://github.com/xenserver/xenadmin'>XenCenter</a> and the <a href='https://github.com/xapi-project/xen-api/tree/master/ocaml/sdk-gen'>XenServer SDKs</a>.
          </p>
          <div className={indexStyles.socialIcons}>
            <Social />
          </div>
        </div>
      </section>
      <section className={indexStyles.contactSection}>
        <div className="container">
          <h2>Send a message</h2>
          <ContactForm />
        </div>
      </section>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 100, height: 100) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
        author {
          name
          firstName
          descriptions
        }
      }
    }
  }
`
