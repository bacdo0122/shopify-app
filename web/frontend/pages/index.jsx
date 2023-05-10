import {
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  TextField,
  Select,
  ChoiceList,
  AlphaCard,
  Text,
  Button,
  InlineError,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";
import '../css/table.css'
import { ProductsCard } from "../components";
import { useCallback, useState } from "react";
import ModalComponent from "../components/Modal";
import ProductList from "../components/ProductList";
import CollectionsProduct from "../components/CollectionProduct";
import UseFetchCollection from "../hooks/useFetchCollection";
import { useSelector } from "react-redux";
import TagsProduct from "../components/TagProduct";

export default function HomePage() {
  const [form, setForm] = useState({
    name: '',
    priority: 0,
    status: "enable"
  })

  const [product, setProduct] = useState(['all']);
  const [price, setPrice] = useState(['all']);
  const [active, setActive] = useState(false); 
  const [amount, setAmount] = useState(0)
  const [productPrice, setProductPrice] = useState([])
  const allProducts = useSelector(state => state.products.products)
  const specificProducts = useSelector(state => state.products.selected)
  const collectionProducts = useSelector(state => state.collections.selected)
  const tagsProduct = useSelector(state => state.tags.selected)

  const handleModalChange = useCallback(() => setActive(!active), [active]); 
  const handleChoiceListProductChange = useCallback(
    value => {
      setProduct(value)
    },
    [], 
  );
  const handleChoiceListPriceChange = useCallback(
    value => {
      setPrice(value)
    },
    [], 
  );
  
  const handleTextFieldChange = useCallback(()=>{setActive(true)},[])

  const renderChildren = useCallback(
    (isSelected) =>
      isSelected && (
        <>
       { product[0] === 'specific' && <>
          <TextField
              placeholder="Search product"
              onFocus={handleTextFieldChange} 
              autoComplete="off"
            />
          <ProductList type="products" data={[]}/>
       </>
       }
       { product[0] === 'collection' && 
          <>
          <CollectionsProduct />
          </>
       }
       { product[0] === 'tag' && 
          <>
          <TagsProduct />
          </>
       }

        </>
      ),
    [product],
  );
  

  const textFieldID = 'ruleContent';
  const isInvalidName = isValueInvalid("name",form.name);
  const isInvalidPriority = isValueInvalid("priority",form.priority);
  const errorMessageName = isInvalidName
  ? 'Enter 1 or more characters for name'
  : '';
  const errorMessagePriority = isInvalidPriority
  ? 'Please enter an integer from 0 to 99. 0 is the highest priority'
  : '';

  const customPrice = (products) => {
    let setPriceProduct = []
    if(price[0] === 'all'){
      setPriceProduct =  products.map(item => 
     ( 
      {
        node:{
          ...item.node,
          priceRange: {
            ...item.node.priceRange,
            maxVariantPrice:{
              amount: Number(item.node.priceRange.maxVariantPrice.amount) < amount ?  Number(item.node.priceRange.maxVariantPrice.amount) : amount
            }
          }
        }
      }
      )
      )
      setProductPrice(setPriceProduct)
    }
    else if(price[0] === 'fixed'){
      setPriceProduct =  products.map(item => 
        ( 
         {
           node:{
             ...item.node,
             priceRange: {
               ...item.node.priceRange,
               maxVariantPrice:{
                 amount: Number(item.node.priceRange.maxVariantPrice.amount) < amount ? 0 : (Number(item.node.priceRange.maxVariantPrice.amount) - amount)
               }
             }
           }
         }
         )
         )
         setProductPrice(setPriceProduct)
    }
    else{
      setPriceProduct =  products.map(item => 
        ( 
         {
           node:{
             ...item.node,
             priceRange: {
               ...item.node.priceRange,
               maxVariantPrice:{
                 amount: Math.floor(Number(item.node.priceRange.maxVariantPrice.amount)*(1 - (amount / 100)))
               }
             }
           }
         }
         )
         )
         setProductPrice(setPriceProduct)
    }

  }


  const handleSaveDiscount = useCallback( () => {

    if(product[0] === 'all'){
      customPrice(allProducts)
    }
    else if(product[0] === 'specific'){
      const data = specificProducts.map(item => ({node: {...item}}))
      customPrice(data)
    }
    else if(product[0] === 'collection'){
      const filterProductsByCollection = allProducts.filter(product => {
        const check =  product.node.collections.edges.filter(item => collectionProducts.some(collection => collection.title === item.node.title))
        if(check.length > 0) return true;
        return false
      })
      customPrice(filterProductsByCollection)
    }
    else{
      const filterProductsByTags = allProducts.filter(product => {
        const check =  product.node.tags.filter(item => tagsProduct.some(tag => tag.node === item))
        if(check.length > 0) return true;
        return false
      })
      customPrice(filterProductsByTags)
    }
  },[product, allProducts, price,amount, collectionProducts, tagsProduct,specificProducts]
  )



  const setTablePrice =
   productPrice.length > 0 ?
    productPrice.map(product => {
      return (
        <tr>
        <td>{product.node.title}</td>
        <td>{product.node.priceRange.maxVariantPrice.amount}</td>
      </tr>
      )
    }) : null;
    

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section >
          <LegacyCard  title="General Information" sectioned>
            <FormLayout>
             <TextField label="Name"
             error={isInvalidName}
              onChange={(value) => {
                setForm({...form, name: value })
              }} 
              autoComplete="off" value={form.name} />
              <InlineError message={errorMessageName} fieldID={textFieldID} />
              <TextField
                label="Priority"
                type="number"
                min={0}
                error={isInvalidPriority}

                max={99}
                autoComplete="off"
                onChange={(value) => {
                  setForm({...form, priority: value })
                }} 
                value={form.priority}
                helpText="Please enter an integer from 0 to 99. 0 is the highest priority"
              />
                <InlineError message={errorMessagePriority} fieldID={textFieldID} />
              <Select label="Status" 
                options={[
                  {label: 'Enable', value: 'enable'},
                  {label: 'Disable', value: 'disable'},
                ]}
                value={form.status}
                onChange={(value) => {
                  setForm({...form, status: value })
                }} 
              />

            </FormLayout>
          </LegacyCard  >
          <LegacyCard  title="Apply to Products" sectioned>
              <ChoiceList
                choices={[
                  {label: 'All products', value: 'all'},
                  {label: 'Specific products', value: 'specific', renderChildren},
                  {label: 'Product Collections', value: 'collection', renderChildren},
                  {label: 'Product Tags', value: 'tag', renderChildren},
                ]}
                selected={product}  
                onChange={handleChoiceListProductChange}
              />
          
          </LegacyCard  >
          <LegacyCard  title="Custom Prices" sectioned>
              <ChoiceList
                choices={[
                  {label: 'Apply a price to selected products', value: 'all'},
                  {label: 'Descrease a fixed amount of the original prices of selected products', value: 'fixed'},
                  {label: 'Descrease  the original prices of selected products by a percentage (%)', value: 'percent'},
                ]}
                selected={price}  
                onChange={handleChoiceListPriceChange}
              />
            <TextField
                label="Amount"
                type="number"
                autoComplete="off"
                value={amount}
                helpText="Amount must be bigger than 0"
                onChange={(value) => setAmount(value)}
              />
              <div  style={{
                    margin: 'var(--p-space-2) 0',
                  }}>
              <Button primary onClick={handleSaveDiscount}>Save</Button>
                
              </div>
          </LegacyCard  >
        </Layout.Section>
        <Layout.Section oneThird>

              <div className="table__title"  >
                <Text as="h2" variant="bodyMd">
                  Show product pricing details
                </Text>
              </div>
              <table id="table" >
                <tr>
                  <th>Title</th>
                  <th>Final Price(đ)</th>
                </tr>
               {setTablePrice}
              </table>
        </Layout.Section>
                {(active && product[0] === 'specific') && <ModalComponent active={active}  handleModalChange={handleModalChange}/>}
        </Layout>
    </Page>
  );
}

const isValueInvalid = (type, value) => {
  if(type === "name"){
    if(value.length <= 0) return true
  }
  else{
    if(Number(value) < 0 || Number(value) > 99) return true
  }
}