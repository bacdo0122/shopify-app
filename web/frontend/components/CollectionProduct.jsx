import {
    Tag,
    Listbox,
    Combobox,
    Icon,
    TextContainer,
    LegacyStack,
    AutoSelection,
    VerticalStack
  } from "@shopify/polaris";
  import { SearchMinor } from "@shopify/polaris-icons";
  import { useState, useCallback, useMemo, useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { useDispatch, useSelector } from "react-redux";
import ProductList from "./ProductList";
import { setCollectionSelected } from "../reducers/collection";
  
  function CollectionsProduct() {
    const collections = useSelector(state => state.collections.collections)
    const collectionsSelected = useSelector(state => state.collections.selected)

    const dispatch = useDispatch();
    const deselectedOptions = useMemo(
      () => collections && collections.map(item => ({id:item.node.id, title: item.node.title, image:item.node.image})),
       [] 
    );
          
      const [selectedOptions, setSelectedOptions] = useState(collectionsSelected.length === 0 ? [] : collectionsSelected);
      const [inputValue, setInputValue] = useState("");
      const [options, setOptions] = useState(deselectedOptions);

      
    const updateText = useCallback(
      (value) => {
        setInputValue(value);
        
        if (value === "") {
          setOptions(deselectedOptions);
          return;
        }
  
        const filterRegex = new RegExp(value, "i");
        const resultOptions = deselectedOptions.filter((option) =>
          option.title.match(filterRegex)
        );
        setOptions(resultOptions);
      },
      [deselectedOptions]
    );
  
    const updateSelection = useCallback(
      (selected) => {
        const check = selectedOptions.find(item => item.title === selected);
        if (check) {
          dispatch(setCollectionSelected(selectedOptions.filter((option) => option.title !== selected)))
          setSelectedOptions(
            selectedOptions.filter((option) => option.title !== selected)
          );
        } else {
            const data = deselectedOptions.find(item => item.title === selected)
          setSelectedOptions([...selectedOptions, data]);
          dispatch(setCollectionSelected([...selectedOptions, data]))
        }
        updateText("");
      },
      [selectedOptions, updateText]
    );

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
              label="Search collection"
              labelHidden
              value={inputValue}
              placeholder="Search collection"
              autoComplete="off"
            />
          }
        >
          {optionsMarkup ? (
            <Listbox
              autoSelection={AutoSelection.None}
              onSelect={updateSelection}
            >
              {optionsMarkup}
            </Listbox>
          ) : null}
        </Combobox>
        <ProductList type="collections" data={selectedOptions} action={updateSelection}/>
        </>
    );
  }
  
  export default CollectionsProduct;
  