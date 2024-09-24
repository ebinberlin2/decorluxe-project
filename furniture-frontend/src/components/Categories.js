import React from 'react';
import bed from '../assets/bed.jpg';
import cupboard from '../assets/cupboard.jpg';
import Decoration from '../assets/Decoration.jpg';
import lighting from '../assets/lighting.jpg';
import sofa from '../assets/sofa.jpg';
import './Categories.css';

const Categories = () => (
    <div className="categories-container">

        <div className="category-item">
            <img src={bed} className="category-img" />
            <span>Bed</span>
        </div>

        <div className="category-item">
            <img src={cupboard} className="category-img"/>
            <span>Cupboard</span>
        </div>

        <div className="category-item">
            <img src={Decoration} className="category-img"/>
            <span>Decoration</span>
        </div>

        <div className="category-item">
            <img src={lighting} className="category-img"/>
            <span>Lighting</span>
        </div>

        <div className="category-item">
            <img src={sofa} className="category-img"/>
            <span>Sofa</span>
        </div>

        <div className="pub__scroll-indicator">
            <div className="pub__scroll-indicator__bar-wrapper">
                <div className="pub__scroll-indicator__bar"></div>
            </div>
        </div>

    </div>



);

export default Categories;