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

export default function HomePage() {
  const [form, setForm] = useState({
    name: '',
    priority: 0,
    status: "enable"
  })
  const [product, setProduct] = useState(['all']);
  const [active, setActive] = useState(false);
  const handleModalChange = useCallback(() => setActive(!active), []);
  const handleChoiceListChange = useCallback(
    value => {
      setProduct(value)
    },
    [],
  );

  const handleTextFieldChange =useCallback(()=>{setActive(true)},[])
  const renderChildren = useCallback(
    (isSelected) =>
      isSelected && (
        <TextField
          placeholder="Search product"
          onFocus={handleTextFieldChange}
          autoComplete="off"
        />
      ),
    [],
  );

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
                title="Company name"
                choices={[
                  {label: 'All products', value: 'all'},
                  {label: 'Specific products', value: 'specific', renderChildren},
                  {label: 'Product Collections', value: 'collection'},
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
        <ModalComponent active={active} activetor={renderChildren} handleModalChange={handleModalChange}/>
      </Layout>
    </Page>
  );
}
