import React, { useState } from 'react'
import { useDataLayerValue } from '../context-api/DataLayer'
import { actionTypes } from '../context-api/reducer'
import { useAlert } from 'react-alert'
import ReactModal from 'react-modal'
import InputBox from './form-elements/InputBox'
import TextAreaBox from './form-elements/TextAreaBox'
import SelectBox from './form-elements/SelectBox'
import ModalTitle from './form-elements/ModalTitle'

function ProductItem({ item }) {
  const [editItemId, setEditItemId] = useState(item.id)
  const [itemImage, setItemImage] = useState('')
	const [itemTitle, setItemTitle] = useState('')
	const [itemPrice, setItemPrice] = useState(0)
	const [itemCateory, setItemCateory] = useState('')
	const [itemDescription, setItemDescription] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // DataLayer - React context api
  const [{ BASE_URL, categories, products }, dispatch] = useDataLayerValue()
  // react alert
  const alert = useAlert()

  const modalStyle = {
		overflow: {
			background: 'rgba(0, 0, 0, 0.3)'
		},
		content: {
			maxWidth: '500px',
			margin: 'auto',
		}
	}

  const LoadProduct = (id) => {
    setEditItemId(id)
    setIsEditModalOpen(true)
    const test = products.filter((product) => {
      return product.id === id
    })
    setItemImage(test[0].image)
    setItemTitle(test[0].title)
    setItemPrice(test[0].price)
    setItemCateory(test[0].category.id)
    setItemDescription(test[0].description)
    console.log('LOAD VAL: ', test[0])
  }
  
  const EditProduct = (evt, id) => {
    evt.preventDefault()
		const data = JSON.stringify({
      "image": itemImage,
      "title": itemTitle,
      "price": itemPrice,
      "description": itemDescription,
      "category": itemCateory,
		})

		fetch(`${BASE_URL}/items/${editItemId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: data,
		})
		.then(response => response.json())
		.then(feedback => {
			// set products value
			fetch(`${BASE_URL}/items`)
      .then(response => response.json())
      .then(feedback => {
        dispatch({
					type: actionTypes.SET_PRODUCTS,
					products: feedback.data,
				})
      })
			setIsEditModalOpen(false)
			setItemImage('')
      setItemTitle('')
      setItemPrice('')
      setItemCateory('')
      setItemDescription('')
			alert.show(feedback.message)
		})
  }

  const DeleteProduct = (id) => {
    const newProducts = products.filter((product) => product.id !== id )
    dispatch({
      type: actionTypes.SET_PRODUCTS,
      products: newProducts,
    })
    // delete from api
    fetch(`${BASE_URL}/items/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(feedback => {
      alert.show(feedback.message)
    })
  }

  return (
    <div className="hello">
      <div className="shadow-lg ">
        <img className="max-h-52  h-full w-full object-cover " 
          // src="https://cdn.pocket-lint.com/r/s/1200x/assets/images/120309-phones-news-buyer-s-guide-best-smartphones-2020-the-top-mobile-phones-available-to-buy-today-image27-gfxwnxca2p.jpg" 
          src={itemImage} 
          alt="ProductImage"
        />
        <div className="text-sm  p-4">
          <div className="text-sm font-semibold ">
            Price: GHS{item.price}
          </div>
          <div className="text-sm font-semibold ">
            Title: {item.title}
          </div>
          <div className="text-sm font-semibold ">
            Category: {item.category.name}
          </div>
          <div className="text-sm font-semibold ">
            Description: {item.description}
          </div>
          <aside className="flex uppercase gap-x-3 my-2">
            <div onClick={() => LoadProduct(item.id)} className="p-1 bg-blue-100 rounded text-blue-500 text-xs px-3 cursor-pointer hover:shadow-md ">
              Edit
            </div>
            <div onClick={() => DeleteProduct(item.id)} className="p-1 bg-red-100 rounded text-red-500 text-xs px-3 cursor-pointer hover:shadow-md ">
              Delete
            </div>
          </aside>
        </div>
      </div>

      <ReactModal 
        isOpen={isEditModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsEditModalOpen(false)}
				style={modalStyle}
      >
				{/* close btn */}
				<button onClick={() => setIsEditModalOpen(false)} className="btn p-1 uppercase bg-red-100 rounded text-red-500 text-xs px-3 cursor-pointer shadow-md " >Close X</button>
        <ModalTitle title="Add New Item" />
				<form method="PUT" onSubmit={EditProduct}>
					<div className="my-10">
						<input key="i0" onChange={() => setItemImage} type="file" name="itemImage" />

            <InputBox onInputBoxChange={setItemTitle} 
                key="i1"
                label="Title" 
                name="itemTitle" 
                stateVal={itemTitle}
              />

              <InputBox onInputBoxChange={setItemPrice} 
                key="i2"
                label="Price" 
                name="itemPrice" 
                stateVal={itemPrice}
              />

              <SelectBox onInputBoxChange={setItemCateory} 
                key="i3"
                label="Select Category" 
                name="itemCateory" 
                optionList={categories}
                stateVal={itemCateory}
                isBeingEdited={true}
              />

              <TextAreaBox onInputBoxChange={setItemDescription} 
                key="i4"
                label="Description" 
                name="itemDescription" 
                stateVal={itemDescription}
              />
					</div>
					<button type="submit" className="w-9/12 m-auto outline-none btn table p-2 px-5 rounded shadow-2xl uppercase cursor-pointer text-xs bg-blue-600 text-white ">
						Update Item
					</button>
				</form>
			</ReactModal>
    </div>
  )
}

export default ProductItem
