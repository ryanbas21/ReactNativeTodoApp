import React, { useState } from 'react';
import { VStack, Checkbox, Text, Modal } from 'native-base';
import { handleFailedPolicies } from '../utilities/failedPolicies';

function TermsModal({ terms, showModal, setModal }) {
  return (
    <React.Fragment>
      <Text
        onPress={() => setModal(true)}
        color={'#0066CC'}
        fontWeight={'semibold'}>
        Show Terms
      </Text>
      <Modal isOpen={showModal} onClose={() => setModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Terms and Conditions</Modal.Header>
          <Modal.Body>{terms}</Modal.Body>
        </Modal.Content>
      </Modal>
    </React.Fragment>
  );
}

const Specials = ({ label, val, setter, terms = null, output }) => {
  const [showModal, setShowModal] = useState(false);
  console.log(terms);
  return (
    <VStack margin={2}>
      <Text>{handleFailedPolicies(output)}</Text>
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
