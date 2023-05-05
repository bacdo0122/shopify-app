import { Button, Modal, LegacyStack, ChoiceList, LegacyCard, ResourceList, LegacyFilters, Text, Avatar, Filters, TextField, ResourceItem, Thumbnail } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuthenticatedFetch } from '../hooks/index';
import { debounce } from 'lodash'
import { useSelector } from 'react-redux';
export default function ProductList() {
    const products = useSelector((state) => state.products.products)
    const [productList,setProductList] = useState([])
  //
  const fetch = useAuthenticatedFetch()

  useMemo(async ()=>{
    try {
        const data = Promise.all(
            products.map(async (id) => {
               const res = await fetch(`/api/product/${id}`)
               return await res.json()
            })
        )
        console.log(await data)
    } catch (error) {
        console.log(error)
    }
  },[products])
  return (
   
          <LegacyCard>
                    <ResourceList
                    resourceName={{ singular: "customer", plural: "customers" }}
                    items={[
                    {
                        id: "109",
                        url: "#",
                        name: "Mae Jemison",
                        location: "Decatur, USA",
                        latestOrderUrl: "#"
                    },
                    {
                        id: "209",
                        url: "#",
                        name: "Ellen Ochoa",
                        location: "Los Angeles, USA",
                        latestOrderUrl: "#"
                    }
                    ]}
                    renderItem={(item) => {
                    const { id, url, name, location } = item;
                    const media = <Avatar customer size="medium" name={name} />;
                    const shortcutActions = undefined;

                    return (
                        <ResourceItem
                        id={id}
                        url={url}
                        media={media}
                        accessibilityLabel={`View details for ${name}`}
                        shortcutActions={shortcutActions}
                        >
                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                            {name}
                        </Text>
                        <div>{location}</div>
                        </ResourceItem>
                    );
                    }}
                />
          </LegacyCard>
  );
}
