import { Button, Modal, LegacyStack, ChoiceList, LegacyCard, ResourceList, LegacyFilters, Text, Avatar, Filters, TextField, ResourceItem, Thumbnail } from '@shopify/polaris';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuthenticatedFetch } from '../hooks/index';
import { debounce } from 'lodash'
import {useDispatch, useSelector} from 'react-redux'
import { setProductSelected, setProducts } from '../reducers/product';
import { json } from 'react-router-dom';
export default function ModalComponent({ active, handleModalChange }) {
  const [queryValue, setQueryValue] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState([])
  const dispatch = useDispatch()
  const handleClose = () => {
    handleModalChange();
  };
  const products = useSelector((state) => state.products.products)
  const fetch = useAuthenticatedFetch()
  const fetchProducts = async (value) => {
    try {
      let json;
      if (value !== "" && value !== undefined) {
        const res = await fetch(`/api/products?name=${value}`)
        json = await res.json()
        setData(json.body.data.products.edges)
      }
      else {
        console.log(products)
        setData(products)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const debounceDropDown = useCallback(debounce((nextValue) => fetchProducts(nextValue), 500), [])
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

  const handleSaveProduct = useCallback(async()=>{
    try {
      const res = await fetch(`/api/products?ids=${JSON.stringify(selectedItems)}`)
      const json = await res.json()
      dispatch(setProductSelected(json.body.data.nodes))
    } catch (error) {
      console.log(error)
    }
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
              items={data && data.map(item => ({id: item.node.id, images: item.node.images, title: item.node.title}))}
              renderItem={(item) => {
              
                const { id, images, title } = item;
                // console.log(id)
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
