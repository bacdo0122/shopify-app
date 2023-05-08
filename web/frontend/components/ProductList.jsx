import { Button, Modal, LegacyStack, ChoiceList, LegacyCard, ResourceList, LegacyFilters, Text, Avatar, Filters, TextField, ResourceItem, Thumbnail } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuthenticatedFetch } from '../hooks/index';
import { debounce } from 'lodash'
import { useSelector } from 'react-redux';
export default function ProductList({ type, data = [] }) {
  const products = useSelector((state) => state.products.products)
  const [productList, setProductList] = useState(data)
  //
  const fetch = useAuthenticatedFetch()
  useMemo(() => { setProductList(data) }, [data])
  
  useMemo(async () => {
    try {
      if (products.length > 0 && type === "products") {

        if (type === "products") {
          const data = await fetch(`/api/products?ids=[${products}]`);
          const json = await data.json();
          setProductList(json.body.data.nodes)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [products])

  return (

    <LegacyCard>
      <ResourceList
        resourceName={{ singular: "customer", plural: "customers" }}
        items={productList && productList}
        renderItem={(item) => {
          const { id, images, title, image } = item;
          const media = <Thumbnail size="medium" alt={title} source={images ? images.edges[0].node.src : (image || "https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg")} />;

          return (
            <ResourceList.Item
              id={id}
              url={images ? images.edges[0].node.src : image}
              media={media}
              accessibilityLabel={`View details for ${title}`}
            >
              <Text as="h3" variant="bodyMd" fontWeight="bold">
                {title}
              </Text>
            </ResourceList.Item>
          );
        }}
      />
    </LegacyCard>
  );
}
