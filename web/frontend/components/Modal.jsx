import { Button, Modal, LegacyStack, ChoiceList, LegacyCard, ResourceList, LegacyFilters, Text, Avatar, Filters, TextField, ResourceItem, Thumbnail } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuthenticatedFetch } from '../hooks/index';
import { debounce } from 'lodash'
import {useDispatch} from 'react-redux'
import { setProducts } from '../reducers/product';
export default function ModalComponent({ active, handleModalChange }) {
  const [queryValue, setQueryValue] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const handleClose = () => {
    handleModalChange();
  };
  
  const fetch = useAuthenticatedFetch()
  const fetchProducts = async (value) => {
    try {
      let json;
      if (value !== "" && value !== undefined) {
        console.log("a") 
        const res = await fetch(`/api/products?name=${value}`)
        json = await res.json()
  
      }
      else {
        console.log("b") 
        const res = await fetch(`/api/products`)
        json = await res.json()
      }
      setData(json.body.data.products.edges)
    } catch (error) {
      console.log(error)
    }
  }
  const debounceDropDown = useCallback(debounce((nextValue) => fetchProducts(nextValue), 1000), [])
  useMemo(() => {
    debounceDropDown(queryValue)
  }, [queryValue])



  // fetchProducts()
  const handleFiltersQueryChange = useCallback(
    (value) => {
      setQueryValue(value)

    },
    [],
  );

  const handleQueryValueRemove = useCallback(
    () => {
      setQueryValue('')
    },
    [],
  );

  const handleSaveProduct = useCallback(()=>{
    dispatch(setProducts(selectedItems))
    handleModalChange();
  },[selectedItems])
  //

  const filters = [];

  //
  return (
    <div style={{ height: '500px' }}>
      <Modal
        open={active}
        onClose={handleClose}
        title="SELECT SPECIFIC PRODUCTS"
        primaryAction={{
          content: 'Select',
          onAction: handleSaveProduct,
        }}
      >
        <Modal.Section>
          <LegacyCard>
            <ResourceList
              resourceName={{ singular: 'product', plural: 'products' }}
              selectedItems={selectedItems}
              onSelectionChange={setSelectedItems}
              selectable
              filterControl={
                <Filters
                  queryValue={queryValue}
                  filters={filters}
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={handleQueryValueRemove}
                  onClearAll={handleQueryValueRemove}
                />
              }
              items={data && data}
              renderItem={(item) => {
              
                const { id, images, title } = item.node;
                const media = <Thumbnail size="medium" alt={title} source={images.edges[0].node.src} />;

                return (
                  <ResourceList.Item
                    id={id}
                    url={images.edges[0].node.src}
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
        </Modal.Section>
      </Modal>
    </div>
  );
}
