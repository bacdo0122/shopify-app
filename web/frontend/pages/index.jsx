import {
  Page,
  Layout,
  LegacyCard,
  FormLayout,
  TextField,
  Select,
  ChoiceList,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import { useCallback, useState } from "react";
import ModalComponent from "../components/Modal";
import ProductList from "../components/ProductList";
import CollectionsProduct from "../components/CollectionProduct";
import UseFetchCollection from "../hooks/useFetchCollection";

export default function HomePage() {
  const [form, setForm] = useState({
    name: '',
    priority: 0,
    status: "enable"
  })

  const [product, setProduct] = useState(['all']);
  const [active, setActive] = useState(true); 
  const handleModalChange = useCallback(() => setActive(!active), [active]); 
  const handleChoiceListChange = useCallback(
    value => {
      setProduct(value)
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
       { product[0] === 'tags' && 
          <>
          <CollectionsProduct />
          </>
       }

        </>
      ),
    [product],
  );

  // const renderChildrenCollection = useCallback(
  //   (isSelected) =>
  //     isSelected && (
  //       <>
  //       <TextField
  //         placeholder="Search collection"
  //         onFocus={ handleTextFieldChange("collection")}
  //         autoComplete="off"
  //       />
  //       <ProductList />
  //       </>
  //     ),
  //   [],
  // );

  return (
    <Page fullWidth>
      <Layout>
        <Layout.Section >
          <LegacyCard  title="General Information" sectioned>
            <FormLayout>
             <TextField label="Name"
              onChange={(value) => {
                setForm({...form, name: value })
              }} 
              autoComplete="off" value={form.name} />
              <TextField
                label="Priority"
                type="number"
                autoComplete="off"
                onChange={(value) => {
                  setForm({...form, priority: value })
                }} 
                value={form.priority}
                helpText="Please enter an integer from 0 to 99. 0 is the highest priority"
              />
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
                  {label: 'Product Tags', value: 'tag'},
                ]}
                selected={product}  
                onChange={handleChoiceListChange}
              />
          
          </LegacyCard  >
        </Layout.Section>
        <Layout.Section secondary>
           <LegacyCard title="Tags" sectioned>
            <p>Add tags to your order.</p>
          </LegacyCard>
        </Layout.Section>
                {(active && product[0] == 'specific') && <ModalComponent active={active}  handleModalChange={handleModalChange}/>}
             

      </Layout>
    </Page>
  );
}
