/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import CategoryItem from './CategoryItem'
import { useDataLayerValue } from '../context-api/DataLayer'
import { actionTypes } from '../context-api/reducer'
// import ModalCreateCategory from './ModalCreateCategory'
import ReactModal from 'react-modal'
import InputBox from './form-elements/InputBox'
import ModalTitle from './form-elements/ModalTitle'
import { useAlert } from 'react-alert'

function CategorySidebar() {
  // DataLayer - React context api
  const [{ categories, BASE_URL }, dispatch] = useDataLayerValue()
	// react alert
  const alert = useAlert()

  // make api call
  useEffect(() => {
    fetch(`${BASE_URL}/categories`)
      .then(response => response.json())
      .then(feedback => {
        // set categories value
        dispatch({
					type: actionTypes.SET_CATEGORIES,
					categories: feedback.data,
				})
      })
  }, [])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
	const [categoryName, setCategoryName] = useState('')

	const modalStyle = {
		overflow: {
			background: 'rgba(0, 0, 0, 0.3)'
		},
		content: {
			maxWidth: '500px',
			margin: 'auto',
		}
	}

	const CreateCategory = (evt) => {
		evt.preventDefault()
		const data = JSON.stringify({
			"name": categoryName,
		})

		fetch(`${BASE_URL}/categories`, {
			method: evt.target.method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: data,
		})
		.then(response => response.json())
		.then(feedback => {
			// set categories value
			categories.unshift(feedback.data)
			dispatch({
				type: actionTypes.SET_CATEGORIES,
				categories: categories,
			})
			setIsCreateModalOpen(false)
			setCategoryName('')
			alert.show(feedback.message)
		})
	}


  return (
    <div className="bg-gray-200 flex flex-col h-full overflow-hidden">
      <h3 className="text-xl m-2 my-3">Categories</h3>
      <div className="flex p-4 justify-end">
        <div onClick={() => setIsCreateModalOpen(true)} className="table p-2 rounded shadow-2xl uppercase cursor-pointer text-xs bg-blue-600 text-white hover:bg-white hover:text-blue-600">
          Create Category
        </div>
      </div>
      <section className="text-left p-4 mt-5 overflow-auto ">
        {(typeof categories != "undefined") ? (
          categories.map((category, key) => {
            return <CategoryItem name={category.name} pos={key} id={category.id} key={category.id} />
          })
        ) :('')}
      </section>

      {/* <ModalCreateCategory open={isModalOpen} /> */}
			<ReactModal 
        isOpen={isCreateModalOpen}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => setIsCreateModalOpen(false)}
				style={modalStyle}
      >
				{/* close btn */}
				<button onClick={() => setIsCreateModalOpen(false)} className="btn p-1 uppercase bg-red-100 rounded text-red-500 text-xs px-3 cursor-pointer shadow-md " >Close X</button>
        <ModalTitle title="Add New Category" />
				<form method="POST" onSubmit={CreateCategory}>
					<div className="my-10">
						<InputBox onInputBoxChange={setCategoryName} 
							key="1"
							label="Category Name" 
							name="categoryName" 
							stateVal={categoryName}
						/>
					</div>
					<button type="submit" className="w-9/12 m-auto outline-none btn table p-2 px-5 rounded shadow-2xl uppercase cursor-pointer text-xs bg-blue-600 text-white ">
						Add Category
					</button>
				</form>
			</ReactModal>
    </div>
  )
}

export default CategorySidebar
