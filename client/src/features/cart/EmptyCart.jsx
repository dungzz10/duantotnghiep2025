import React from 'react'
import { Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh' }}>
      <Empty description={<span>Your cart is empty</span>} />
      <Button type="primary" onClick={() => navigate('/') } style={{ marginTop: '20px' }}>
        Continue Shopping
      </Button>
    </div>
  )
}

export default EmptyCart