import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'
import './styles.css'

interface Props {
    title: string
}

const SuccessModal: React.FC<Props> = (props) => {
    return (
        <div className="success-modal">
            <main>
                <FiCheckCircle size={65} color="#33c777"/>
                <h1>{props.title}</h1>
            </main>
        </div>
    )
}

export default SuccessModal