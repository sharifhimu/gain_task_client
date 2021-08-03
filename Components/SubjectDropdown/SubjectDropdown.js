// import React from 'react';
import styles from '../../styles/Home.module.css'

const SubjectDropdown = ({ setInput, setadd, add, /* handleChange, idx, */ }) => {

    const onDropdownclk = (clk) => {
        console.log('dropdown', clk);
        setInput(clk)
        setadd( { ...add, subject: clk } )
    }

    return (
        <div className={styles.dropdown} >
            <select name="selectList" id="selectList"  onClick={ (e) =>  onDropdownclk(e.target.value) /* handleChange(idx,e.target.value) */ }  >
              <option value="select" > select a subject </option>
              <option value="BANGLA">BANGLA</option>
              <option value="ENGLISH">ENGLISH</option>
              <option value="MATH">MATH</option>
              <option value="PHYSICS">PHYSICS</option>
              <option value="CHEMISTRY">CHEMISTRY</option>
              <option value="STATISTICS">STATISTICS</option>
              <option value="BIOLOGY">BIOLOGY</option>
              <option value="RELIGION">RELIGION</option>

            </select>
        </div>
    );
};

export default SubjectDropdown;