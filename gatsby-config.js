module.exports = {
  siteMetadata: {
    title: `Danilo Del Busso`,
    defaultTitle: `Danilo Del Busso`,
    author: {
      name: `Danilo Del Busso`,
      firstName: `Danilo`,
      lastName: `Del Busso`,
      descriptions: [
        `and i write applications for fun`,
        `and i am a CompSci student`,
      ],
    },
    description: `Danilo Del Busso's Dev Blog & Portfolio`,
    siteUrl: `https://www.danilo-delbusso.github.io/blog`,
    image: `https://raw.githubusercontent.com/danilo-delbusso/blog/master/content/assets/profile-pic-sm.png`,
    social: {
      twitter: `danilo_delbusso`,
      github: `danilo-delbusso`,
      linkedin: `danilo-delbusso`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-embed-gist`,
            options: {
              username: `danilo-delbusso`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-169329705-1`,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          } 
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description:
                    edge.node.frontmatter.description || edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                        description
                      }
                    }
                  }
                }
              } 
            `,
            output: "/rss.xml",
            title: "Danilo Del Busso's Dev Portfolio",
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Danilo Del Busso's Dev Portfolio`,
        short_name: `D. Del Busso Dev`,
        start_url: `/`,
        background_color: `#ffffff`,
        display: `minimal-ui`,
        icon: `content/assets/favicon.png`,
        theme_color_in_head: false,
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-dark-mode`,
  ],
  pathPrefix: "/blog",
}
