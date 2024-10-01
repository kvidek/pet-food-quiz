// src/shopifyService.js

const shopifyDomain = 'kvidek-test-store.myshopify.com'; // Replace with your Shopify store's domain
const storefrontAccessToken = '17bea66c5b398d5e076398d1c2a0e505'; // Replace with your actual API token

// Function to convert query array to GraphQL filter string
const buildGraphQLQueryString = (query) => {
    return query.map(filter => filter.tag).join(" ");
};

// GraphQL query to fetch products based on a search query
// src/shopifyService.js
export const fetchProducts = async (query) => {
    try {
        const queryTags = buildGraphQLQueryString(query);

        console.log('queryTags: ', queryTags);

        const response = await fetch(`https://${shopifyDomain}/api/2024-01/graphql.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            },
            body: JSON.stringify({
                query: `
          {
            products(first: 50, query: "tag:${queryTags}") {
              edges {
                node {
                  id
                  title
                  description
                  handle
                  tags
                  images(first: 1) {
                    edges {
                      node {
                        src
                      }
                    }
                  }
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        priceV2 {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
            }),
        });

        const data = await response.json();

        // Log the entire response for inspection
        console.log("Full API Response:", JSON.stringify(data, null, 2));

        if (data.errors) {
            console.error("GraphQL Errors:", data.errors);
            return [];
        }

        // Check if 'products' exists in the response
        if (data.data && data.data.products) {
            const products = data.data.products.edges.map(edge => edge.node);
            console.log("Products fetched:", products); // Log products found
            return products;
        } else {
            console.error('No products found in the response.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};
