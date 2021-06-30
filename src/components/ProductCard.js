/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useDataLayerValue } from '../context-api/DataLayer'
import { actionTypes } from '../context-api/reducer'
import ReactModal from 'react-modal'
import InputBox from './form-elements/InputBox'
import ModalTitle from './form-elements/ModalTitle'
import { useAlert } from 'react-alert'
import TextAreaBox from './form-elements/TextAreaBox'
import SelectBox from './form-elements/SelectBox'
import ProductItem from './ProductItem'

function ProductCard() {
  // DataLayer - React context api
  const [{ BASE_URL, categories, products }, dispatch] = useDataLayerValue()
	// react alert
  const alert = useAlert()

  // make api call
  useEffect(() => {
    fetch(`${BASE_URL}/items`)
      .then(response => response.json())
      .then(feedback => {
        // set categories value
        dispatch({
					type: actionTypes.SET_PRODUCTS,
					products: feedback.data,
				})
      })
  }, [])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [itemImage, setItemImage] = useState('')
	const [itemTitle, setItemTitle] = useState('')
	const [itemPrice, setItemPrice] = useState(0)
	const [itemCateory, setItemCateory] = useState('')
	const [itemDescription, setItemDescription] = useState('')

	const modalStyle = {
		overflow: {
			background: 'rgba(0, 0, 0, 0.3)'
		},
		content: {
			maxWidth: '500px',
			margin: 'auto',
		}
	}

  const CreateProduct = (evt) => {
		evt.preventDefault()
		let imageData = new FormData()
		imageData.append("file", itemImage)
		// upload image
		fetch(`${BASE_URL}/upload`, {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			body: imageData,
		})
		.then(response => response.json())
		.then(feedback => {
			console.log('UPLOAD: ', feedback)
			setItemImage(feedback.data[0])
		})

		const data = JSON.stringify({
      "image": itemImage,
      "title": itemTitle,
      "price": itemPrice,
      "description": itemDescription,
      "category": itemCateory,
		})

		fetch(`${BASE_URL}/items`, {
			method: evt.target.method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: data,
		})
		.then(response => response.json())
		.then(feedback => {
			console.log('NEW ITEM: ', feedback)
			// set categories value
			fetch(`${BASE_URL}/items`)
      .then(response => response.json())
      .then(feedback => {
        dispatch({
					type: actionTypes.SET_PRODUCTS,
					products: feedback.data,
				})
      })
			setIsCreateModalOpen(false)
			setItemImage('')
      setItemTitle('')
      setItemPrice('')
      setItemCateory('')
      setItemDescription('')
			alert.show(feedback.message)
			console.log(feedback)
		})
	}
  
  return (
    <div className="col-span-2 bg-white flex flex-col">
      <h3 className="text-xl m-2 my-3">Product List</h3>
      <div className="flex p-4 justify-end">
        <div onClick={() => setIsCreateModalOpen(true)} className="table p-2 rounded shadow-2xl uppercase cursor-pointer text-xs bg-blue-600 text-white hover:bg-white hover:text-blue-600">
          Create Item
        </div>
      </div>

			<section className="text-left p-4 mt-5 flex-1 overflow-auto grid grid-cols-3 gap-3 col-span-2">
				{(typeof products != "undefined") ? (
						products.map((item, key) => {
							return <ProductItem item={item} />
						})
					) :('')}
			</section>

      <ReactModal 
        isOpen={isCreateModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsCreateModalOpen(false)}
				style={modalStyle}
      >
				{/* close btn */}
				<button onClick={() => setIsCreateModalOpen(false)} className="btn p-1 uppercase bg-red-100 rounded text-red-500 text-xs px-3 cursor-pointer shadow-md " >Close X</button>
        <ModalTitle title="Add New Item" />
				<form method="POST" onSubmit={CreateProduct} encType="multipart/form-data" >
					<div className="my-10">
						<input onChange={
							(evt) => {
								evt.preventDefault()
								let img = evt.target.files[0]
								setItemImage(URL.createObjectURL(img))
							} 
						} type="file" name="itemImage" accept="image/*" />

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
						/>

            <TextAreaBox onInputBoxChange={setItemDescription} 
							key="i4"
							label="Description" 
							name="itemDescription" 
							stateVal={itemDescription}
						/>
					</div>
					<button type="submit" className="w-9/12 m-auto outline-none btn table p-2 px-5 rounded shadow-2xl uppercase cursor-pointer text-xs bg-blue-600 text-white ">
						Add Product
					</button>
				</form>
			</ReactModal>
    </div>
  )
}

export default ProductCard
