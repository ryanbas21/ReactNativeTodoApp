import React, { useState, Fragment } from 'react';
import { VStack, Checkbox, Text, Modal, useToken } from 'native-base';
import { handleFailedPolicies } from '../utilities/failedPolicies';

function TermsModal({ terms, showModal, setModal }) {
  const [primary] = useToken('colors', ['primary.600']);
  return (
    <Fragment>
      <Text onPress={() => setModal(true)} color={primary} pl={2} fontSize="md">
        Please accept our Terms and Conditions
      </Text>
      <Modal isOpen={showModal} onClose={() => setModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Terms and Conditions</Modal.Header>
          <Modal.Body>{terms}</Modal.Body>
        </Modal.Content>
      </Modal>
    </Fragment>
  );
}

const Specials = ({ label, val, setter, terms = null, output }) => {
  const [showModal, setShowModal] = useState(false);
  console.log(terms);
  return (
    <VStack mb={3}>
      {handleFailedPolicies(output) ? (
        <Text>{handleFailedPolicies(output)}</Text>
      ) : null}
      <Checkbox.Group accessibilityLabel="terms-checkbox">
        <Checkbox onChange={setter} isChecked={val} aria-label="terms">
          {terms !== null ? (
            <TermsModal
              terms={terms}
              showModal={showModal}
              setModal={setShowModal}
              terms={terms}
            />
          ) : (
            label
          )}
        </Checkbox>
      </Checkbox.Group>
    </VStack>
  );
};

export { Specials };
