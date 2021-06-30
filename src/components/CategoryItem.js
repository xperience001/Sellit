import React, { useState } from 'react'
import { useDataLayerValue } from '../context-api/DataLayer'
import { actionTypes } from '../context-api/reducer'
import { useAlert } from 'react-alert'
import ReactModal from 'react-modal'
import InputBox from './form-elements/InputBox'
import ModalTitle from './form-elements/ModalTitle'

function CategoryItem(props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [categoryName, setCategoryName] = useState('')
  const [editCategoryId, setEditCategoryId] = useState('')

  // DataLayer - React context api
  const [{ categories, BASE_URL }, dispatch] = useDataLayerValue()
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

  const LoadCategory = (id) => {
    setEditCategoryId(id)
    setIsEditModalOpen(true)
    const read = categories.filter((category) => {
      return category.id === id
    })
    setCategoryName(read[0].name)
  }

  const EditCategory = (evt, id) => {
    evt.preventDefault()
		const data = JSON.stringify({
			"name": categoryName,
		})

		fetch(`${BASE_URL}/categories/${editCategoryId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: data,
		})
		.then(response => response.json())
		.then(feedback => {
			// set categories value
			fetch(`${BASE_URL}/categories`)
      .then(response => response.json())
      .then(feedback => {
        // set categories value
        dispatch({
					type: actionTypes.SET_CATEGORIES,
					categories: feedback.data,
				})
      })
			setIsEditModalOpen(false)
			setCategoryName('')
			alert.show(feedback.message)
		})
  }

  const DeleteCategory = (id) => {
    const newCategories = categories.filter((category) => category.id !== id )
    dispatch({
      type: actionTypes.SET_CATEGORIES,
      categories: newCategories,
    })
    // delete from api
    fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(feedback => {
      alert.show(feedback.message)
    })
  }

  return (
    <div id={props.id} className="w-full bg-white shadow-sm p-2 rounded-md flex justify-between mb-4">
      <div className="name">
        {props.name}
      </div>
      <aside className="flex uppercase gap-x-3">
        <div onClick={() => LoadCategory(props.id)} className="p-1 bg-blue-100 rounded text-blue-500 text-xs px-3 cursor-pointer hover:shadow-md ">
          Edit
        </div>
        <div onClick={() => DeleteCategory(props.id)} className="p-1 bg-red-100 rounded text-red-500 text-xs px-3 cursor-pointer hover:shadow-md ">
          Delete
        </div>
      </aside>

      <ReactModal 
        isOpen={isEditModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsEditModalOpen(false)}
				style={modalStyle}
      >
				{/* close btn */}
				<button onClick={() => setIsEditModalOpen(false)} className="btn p-1 uppercase bg-red-100 rounded text-red-500 text-xs px-3 cursor-pointer shadow-md " >Close X</button>
        <ModalTitle title="Add New Category" />
				<form method="PUT" onSubmit={EditCategory}>
					<div className="my-10">
						<InputBox onInputBoxChange={setCategoryName} 
							key="1"
							label="Category Name" 
							name="categoryName" 
							stateVal={categoryName}
						/>
					</div>
					<button type="submit" className="w-9/12 m-auto outline-none btn table p-2 px-5 rounded shadow-2xl uppercase cursor-pointer text-xs bg-blue-600 text-white ">
						Update Category
					</button>
				</form>
			</ReactModal>
    </div>
  )
}

export default CategoryItem
