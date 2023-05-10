import { Button, Modal, LegacyStack, ChoiceList, LegacyCard, ResourceList, LegacyFilters, Text, Avatar, Filters, TextField, ResourceItem, Thumbnail, Icon } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuthenticatedFetch } from '../hooks/index';
import { CancelMajor } from '@shopify/polaris-icons'
import { useDispatch, useSelector } from 'react-redux';
import { setCollectionSelected } from '../reducers/collection';
import { setProductSelected } from '../reducers/product';
export default function ProductList({ type, data = [], action }) {
  const productsSelected = useSelector((state) => state.products.selected)
  const collectionsSelected = useSelector((state) => state.collections.selected)

  const [productList, setProductList] = useState(data)
  const dispatch = useDispatch()

  useMemo(() => { 
    if(type === "collections") {
      setProductList(collectionsSelected)
    } 
    if(type === "products"){
      setProductList(productsSelected)
    }
  }, [data, collectionsSelected, productsSelected])
  



  return (

    <LegacyCard>
      <ResourceList
        resourceName={{ singular: "customer", plural: "customers" }}
        items={productList && productList}
        renderItem={(item) => {
          const { id, images, title, image } = item;
          const media = <Thumbnail size="medium" alt={title} source={images ? images.edges[0].node.src : ((image && image.url) || "https://burst.shopifycdn.com/photos/black-leather-choker-necklace_373x@2x.jpg")} />;

          return (
            <ResourceList.Item
              id={id}
              url={images ? images.edges[0].node.src : image}
              media={media}
              verticalAlignment='center'
              accessibilityLabel={`View details for ${title}`}
            >
              <Text as="h3" variant="bodyMd" fontWeight="bold">
                {title}
              </Text>
              <Button icon={CancelMajor} outline={false} onClick={()=>{
                if(type === "collections"){
                  action(title)
                  dispatch(setCollectionSelected(productList.filter(item => item.id !== id)))
                }
                else {
                  dispatch(setProductSelected(productList.filter(item => item.id !== id)))
                }
              }}>  
              </Button>
            </ResourceList.Item>
          );
        }}
      />
    </LegacyCard>
  );
}
