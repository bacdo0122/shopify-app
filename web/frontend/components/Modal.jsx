import {Button, Modal, LegacyStack, ChoiceList} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export default function ModalComponent({active,activetor, handleModalChange}) {
  const CURRENT_PAGE = 'current_page';
  const ALL_CUSTOMERS = 'all_customers';
  const SELECTED_CUSTOMERS = 'selected_customers';
  const CSV_EXCEL = 'csv_excel';
  const CSV_PLAIN = 'csv_plain';


  const handleClose = () => {
    handleModalChange();

  };

 


  return (
    <div style={{height: '500px'}}>
      <Modal
        open={active}
        activator={activetor}
        onClose={handleClose}
        title="Export customers"
        primaryAction={{
          content: 'Export customers',
          onAction: handleClose,
        }}
      >
        <Modal.Section>
          <LegacyStack vertical>
            <LegacyStack.Item>
              <ChoiceList
                title="Export"
                choices={[
                  {label: 'Current page', value: CURRENT_PAGE},
                  {label: 'All customers', value: ALL_CUSTOMERS},
                  {label: 'Selected customers', value: SELECTED_CUSTOMERS},
                ]}
              />
            </LegacyStack.Item>
            <LegacyStack.Item>
              <ChoiceList
                title="Export as"
                choices={[
                  {
                    label:
                      'CSV for Excel, Numbers, or other spreadsheet programs',
                    value: CSV_EXCEL,
                  },
                  {label: 'Plain CSV file', value: CSV_PLAIN},
                ]}
              />
            </LegacyStack.Item>
          </LegacyStack>
        </Modal.Section>
      </Modal>
    </div>
  );
 }
      