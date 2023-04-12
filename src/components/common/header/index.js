import React from 'react'
import './header.css'
function Header() {
    return (
        <div className='header'>
            <div className='header-menu'>
                <i class="bi bi-columns-gap"></i>
            </div>
            <div className='header-leftFold'>
                <label className='header-label'>Quinones</label>
            </div>
            <div className='header-rightFold'>
                <div className='header-search'>
                    <i class="bi bi-search"></i>
                    <input placeholder='Search'/>
                </div>
                <div className='header-profile'>
                    <div className='header-options'>
                        <i class="bi bi-three-dots"></i>
                    </div>
                    
                    <i className='header-avatar' 
                    class="bi bi-person-circle"></i>

                    


                </div>
            </div>
        </div>
    );
}

export default Header;