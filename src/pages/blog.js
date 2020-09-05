import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import projectsStyles from "../css/projects.module.css"
import Item from "../components/item"

const Blog = ({ data }) => {
  const posts = data.allMarkdownRemark.edges

  const content = (
    <>
      {posts.map(({ node }) => {
        if(node.frontmatter.tags.includes('hide-post')){
          return <></>;
        }
        const title = node.frontmatter.title || node.fields.slug
        return (
          <Item
            key={node.fields.slug}
            title={title}
            path={node.fields.slug}
            isInternal={true}
            headerContent={
              <>
                <span className={projectsStyles.tagContainer}>
                  {node.frontmatter.tags.split("_").map(tag => (
                    <small
                      key={`${node.frontmatter.title}_${tag}`}
                      dangerouslySetInnerHTML={{ __html: tag }}
                    ></small>
                  ))}
                </span>
                <small>{node.frontmatter.date}</small>
              </>
            }
            description={node.frontmatter.description || node.excerpt}
          />
        )
      })}
    </>
  )

  return (
    <Layout>
      <SEO title="Blog" />
      <section className="page-section">
        <div className="container">
          <h2 className="title">Blog</h2>
          {content}
        </div>
      </section>
    </Layout>
  )
}

export default Blog

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
            tags
          }
        }
      }
    }
  }
`
