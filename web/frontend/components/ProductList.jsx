import { Button, Modal, LegacyStack, ChoiceList, LegacyCard, ResourceList, LegacyFilters, Text, Avatar, Filters, TextField, ResourceItem, Thumbnail, Icon } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuthenticatedFetch } from '../hooks/index';
import { CancelMajor } from '@shopify/polaris-icons'
import { useSelector } from 'react-redux';
export default function ProductList({ type, data = [] }) {
  const productsSelected = useSelector((state) => state.products.selected)
  const [productList, setProductList] = useState(data)


  useMemo(() => { 
    if(type === "collections") {
    setProductList(data)
  } 
}, [data])
  
  useMemo(async () => {
    try {
        if(type === "products"){
          setProductList(productsSelected)
        }
    } catch (error) {
      console.log(error)
    }
  }, [productsSelected])

  const handleSaveProduct = useCallback(()=>{
    console.log("a")
  },[])
  return (

    <LegacyCard>
      <ResourceList
        resourceName={{ singular: "customer", plural: "customers" }}
        items={productList && productList}

        renderItem={(item) => {
          const { id, images, title, image } = item;
          const media = <Thumbnail size="medium" alt={title} source={images ? images.edges[0].node.src : ((image && image.url) || "https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg")} />;
          const shortcutActions = title
          ? [
              {
                content: 
                    <Icon
                    source={CancelMajor}
                    color="base"
                  />,
                url: title,
                onActiononMouseEnter: handleSaveProduct
              },
            ]
          : undefined;
          return (
            <ResourceList.Item
              id={id}
              url={images ? images.edges[0].node.src : image}
              media={media}
              shortcutActions={shortcutActions}
              persistActions
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
