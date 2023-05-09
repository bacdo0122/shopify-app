import {
    Tag,
    Listbox,
    Combobox,
    Icon,
    TextContainer,
    LegacyStack,
    AutoSelection,
    VerticalStack,
    TextField,
    LegacyCard,
    Box
  } from "@shopify/polaris";
  import { SearchMinor } from "@shopify/polaris-icons";
  import { useState, useCallback, useMemo, useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "./ProductList";
import {CirclePlusMinor} from '@shopify/polaris-icons';
import { setCollectionSelected } from "../reducers/collection";
  
  function TagsProduct() {
    const tags = useSelector(state => state.tags.tags)
    const dispatch = useDispatch();
    const deselectedOptions = useMemo(
      () => tags && tags.map(item => ({title:item.node})),
       [] 
    );
          
      const [selectedOptions, setSelectedOptions] = useState([]);
      const [inputValue, setInputValue] = useState("");
      const [options, setOptions] = useState(deselectedOptions);

      
    const updateText = useCallback(
      (value, add=false) => {
        setInputValue(value);
        if (value === "") {
          setOptions(deselectedOptions);
          return;
        }
  
        const filterRegex = new RegExp(value, "i");
        const resultOptions = deselectedOptions.filter((option) =>
          option.title.match(filterRegex)
          );
         
         if(add){
          setOptions([...deselectedOptions, {title: value}]);
         }
         else{
          setOptions(resultOptions);
         }

      },
      [deselectedOptions]
    );
  
    const updateSelection = useCallback(
      (selected) => {
        const check = selectedOptions.find(item => item.title === selected);
        if (check) {
          setSelectedOptions(
            selectedOptions.filter((option) => option.title !== selected)
          );
          updateText("");
        } else {
            const data = deselectedOptions.find(item => item.title === selected)
            if(data){
              setSelectedOptions([...selectedOptions, data]);
              updateText("");
            }
            else{
              setSelectedOptions([...selectedOptions, {title: selected}]);
              updateText(selected, true);
            }
        }

      },
      [selectedOptions, updateText]
    );
  
      const handleActiveOptionChange = useCallback((activeOption)=>{
        console.log(activeOption)
      },[])

      const actionMarkup = (inputValue && !options.find(item => item.title === inputValue)) ? <Listbox.Action  value={inputValue} icon={CirclePlusMinor}>
      {`Add ${inputValue}`}
     </Listbox.Action> : null;
  
    const optionsMarkup =
      options.length > 0
        ? options.map((option) => {
            const { title } = option;
  
            return (
              <Listbox.Option
                key={`${title}`}
                value={title}
                selected={selectedOptions.find(item => item.title === title)}
                accessibilityLabel={title}
              >
                {title}
              </Listbox.Option>
            );
          })
        : null;
  
    return (
        <>
        <Combobox
          allowMultiple
          activator={
            <Combobox.TextField
              onChange={updateText}
              label="Search Tags"
              labelHidden
              value={inputValue}
              placeholder="Search Tags"
              autoComplete="off"
            />
          }
        >
          <LegacyCard>
                    {(optionsMarkup || actionMarkup) ? (
                      <>
                      <Listbox
                        autoSelection={AutoSelection.None}
                        onSelect={updateSelection}
                        onActiveOptionChange={handleActiveOptionChange}
                      >
                        {actionMarkup}
                        <Box role="combobox" padding={"2"} borderBlockEndWidth="1" borderColor="border">Suggest TAGS</Box>
                        {optionsMarkup}
                      </Listbox>
                      </>
                    ) : null}
                </LegacyCard>
        </Combobox>
        {/* <ProductList type="collections" data={selectedOptions}/> */}
        </>
    );
  }
  
  export default TagsProduct;
  