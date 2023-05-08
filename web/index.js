// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products", async (_req, res) => {     
 try {
   const client = new shopify.api.clients.Graphql({session:res.locals.shopify.session})
   let data;
 if(_req.query.name && _req.query){      
  data = await client.query({ 
   data: `query { 
     products(first: 15, query: "title:*${_req.query.name}*") {
       edges {
         node {
           id
           title
           handle 
           images(first: 1) {
            edges {
              node {
                id
                src  
              }
            }
          }
         }
       }
     }
   }`,
 });
 }
 else if(_req.query.ids){
  const ids = JSON.parse(_req.query.ids.toString()).map(item => `"` + item + `"`)
    data = await client.query({ 
    data: `query { 
      nodes(ids:${_req.query.ids}) {   
        ... on Product {
          id
          title
          handle 
          images(first: 1) {
           edges {
             node {
               id
               src
             }
           }  
         }
        }
      } 
    }`,  
  });  
  res.status(200).send(data)
 }
 else{
  data = await client.query({
   data: `query {
     products(first: 15) {
       edges {
         node {
           id
           title
           handle
           images(first: 1) {
             edges {
               node {
                 id
                 src
                }
              }
            }
          }
        }
     }
   }`,
  });
}

res.status(200).send(data)
} catch (error) {
  res.status(500).send(error)
}
})
//
app.get("/api/collections", async(_req,res)=>{
  try {
    const client = new shopify.api.clients.Graphql({session:res.locals.shopify.session})
    let data;
    if(_req.query.name && _req.query){
      data = await client.query({ 
        data: `query { 
          collections(first: 15, query: "title:*${_req.query.name}*") {
            edges {
              node {
                id
                title
                handle 
                description
                image {
                  id
                  src
                 }
                updatedAt
              }
            }
          }
        }`,
      });
    }
    else{
      data = await client.query({ 
        data: `query { 
          collections(first: 15) {
            edges {
              node {
                id
                title
                handle 
                description
                image {
                  id
                    src
                 }
                updatedAt
              }
            }
          }
        }`,
      });
    }
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send(error)
  }
})

//tags
app.get("/api/collections", async(_req,res)=>{
  try {
    const client = new shopify.api.clients.Graphql({session:res.locals.shopify.session})
    let data;
    if(_req.query.name && _req.query){
      data = await client.query({ 
        data: `query { 
          productTags(first: 15, query: "title:*${_req.query.name}*") {
            edges {
              node {
                id
              }
            }
          }
        }`,
      });
    }
    else{
      data = await client.query({ 
        data: `query { 
          productTags(first: 15) {
            edges {
              node {
                id
               
              }
            }
          }
        }`,
      });
    }
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send(error)
  }
})


//


// app.get("/api/products/", async (_req, res) =>{
//   // const getIDs = JSON.parse(_req.params.ids).map(item =>  `gid://shopify/Product/${item}`)

//   try {
//     const client = new shopify.api.clients.Graphql({session:res.locals.shopify.session})
//     const  data = await client.query({ 
//       data: `query { 
//         nodes(ids:${getIDs}) {   
//           ... on Product {
//             id,
//             title
//           }
//         } 
//       }`,  
//     });  
//     res.status(200).send(data)
//   } catch (error) {
//     res.status(500).send(error)
//   }
// })
//

//
app.get('/api/productsById', async (_req, res) =>{
  console.log("query:", _req.query.ids)
  try {
    const client = new shopify.api.clients.Graphql({session:res.locals.shopify.session})
    const  data = await client.query({
      data: `query {
        product(id: "gid://shopify/Product/8221646029090") {
          id
          title
          handle
          images(first: 10) { 
           edges {
             node {
               id
               src
             }
           }
         }
        }
      }`,
    });
    res.status(200).send(data)
  } catch (error) {
    res.status(500).send(error)
  }
})
//
//

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
