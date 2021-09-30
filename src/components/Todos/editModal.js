import React, { useState } from 'react';
import { Input, Button, Modal } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const EditModal = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [text, onChange] = useState('');
  return (
    <>
      <Icon name="content-save-edit" onPress={() => setShowModal(true)}>
        Edit
      </Icon>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit Todo</Modal.Header>
          <Modal.Body>
            <Input onChangeText={onChange} value={text} />
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false);
                }}>
                Cancel
              </Button>
              <Button
                onPress={async () => {
                  setShowModal(false);
                  await props.editTodo({ ...props.todo, title: text });
                  onChange('');
                }}>
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
};
