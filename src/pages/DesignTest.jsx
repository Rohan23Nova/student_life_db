import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import './DesignTest.css'; // ← ADD THIS


const DesignTest = () => {
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="design-test">
      <h1>Design System Test</h1>
      
      <Card title="Button Variants" subtitle="Testing all button styles">
        <div className="test-grid">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="accent">Accent Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="danger">Danger Button</Button>
        </div>
      </Card>

      <Card title="Button Sizes" subtitle="Small, medium, and large">
        <div className="test-grid">
          <Button size="sm">Small Button</Button>
          <Button size="md">Medium Button</Button>
          <Button size="lg">Large Button</Button>
        </div>
      </Card>

      <Card title="Button States" subtitle="Loading and disabled">
        <div className="test-grid">
          <Button isLoading={loading} onClick={handleClick}>
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
          <Button disabled>Disabled Button</Button>
        </div>
      </Card>

      <Card 
        title="Hoverable Card" 
        subtitle="Hover over me"
        hoverable
        action={<Button variant="ghost" size="sm">Action</Button>}
      >
        <p>This card has a hover effect and an action button in the header.</p>
      </Card>
      <Card title="Input Fields" subtitle="Form inputs with validation">
  <div style={{ display: 'grid', gap: '1rem' }}>
    <Input 
      label="Email Address" 
      type="email" 
      placeholder="you@example.com"
      required
    />
    <Input 
      label="Password" 
      type="password" 
      placeholder="Enter password"
      helperText="Must be at least 8 characters"
    />
    <Input 
      label="Username" 
      placeholder="johndoe"
      error="This username is already taken"
    />
    <Input 
      label="Disabled Input" 
      value="Can't edit this"
      disabled
    />
  </div>
</Card>
<Card title="Alerts" subtitle="Feedback messages">
  <Alert variant="success" title="Success!">
    Your profile has been updated successfully.
  </Alert>
  <Alert variant="error" title="Error occurred">
    Failed to save changes. Please try again.
  </Alert>
  <Alert variant="warning">
    Your session will expire in 5 minutes.
  </Alert>
  <Alert variant="info" onClose={() => alert('Closed')}>
    New features are available. Check them out!
  </Alert>
</Card>
<Card title="Modal Dialog" subtitle="Click to open modal">
  <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
  
  <Modal
    isOpen={modalOpen}
    onClose={() => setModalOpen(false)}
    title="Example Modal"
    footer={
      <>
        <Button variant="secondary" onClick={() => setModalOpen(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => setModalOpen(false)}>
          Confirm
        </Button>
      </>
    }
  >
    <p>This is a modal dialog. You can put any content here.</p>
    <p>Press ESC or click outside to close it.</p>
  </Modal>
</Card>

      <div className="color-test">
        <h2>Color Palette</h2>
        <div className="color-grid">
          <div className="color-swatch primary"></div>
          <div className="color-swatch accent"></div>
          <div className="color-swatch success"></div>
          <div className="color-swatch warning"></div>
          <div className="color-swatch error"></div>
        </div>
      </div>
    </div>
  );
};

export default DesignTest;