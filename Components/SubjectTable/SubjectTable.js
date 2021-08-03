import React, { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css' ;

const SubjectTable = ( { subject } ) => {

        
    // console.log('subject', subject );

    return (
        <div className={ styles.tablediv } >
            <h1 style={{ color: 'darkslategray' }} > Subject Wise Table </h1>

            <table>
            <thead>
                <tr>
                    <td> Subject </td>
                    <td> Student </td>
                </tr>
            </thead>
            <tbody>
            {
                subject.map((v,i) => {
                    return(
                        <tr key={i} >
                            <td> { v.subject } </td>
                            <td> { v.student.join(', ') } </td>
                        </tr>
                    )
                })
            }
            </tbody>
            </table>
        </div>
    );
};

export default SubjectTable;