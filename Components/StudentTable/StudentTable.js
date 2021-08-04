import { useQuery, gql, useMutation, defaultDataIdFromObject, ApolloClient, InMemoryCache } from "@apollo/client";
import { useState, useEffect } from "react";
import { createQuery, deleteQuery, getAll, updateSubjectQuery } from "../../pages/api/Api";
import SubjectTable from "../SubjectTable/SubjectTable";
// import '../Tablestyle.css';
import styles from '../../styles/Home.module.css'
import SubjectDropdown from "../SubjectDropdown/SubjectDropdown";

  

const StudentTable = ( { info } ) => {

    // console.log('info', info );
    const [info2, setInfo2] = useState(info)
    const [modal, setModal] = useState(false)
    const [modal2, setModal2 ] = useState(false)
    const [modal3, setModal3 ] = useState(false)
    const [modal4, setModal4 ] = useState(false)
    const [input, setInput] = useState('')
    const [ curObj, setObj ] = useState()
    const [add, setadd] = useState({})
    const [delInfo, setDelinfo ] = useState()
    const [delsub, setDelsub] = useState()
    // const [newsub, setNewsub] = useState(0)
    const [fields, setFields] = useState([{ value: null }]);
    const [load, setload ] = useState(false)

  
    const [ updateSubject, {updateerr} ] = useMutation(updateSubjectQuery)
    const [ createPost, {createerr} ] = useMutation(createQuery)
    const [ deletePost, {delerr} ] = useMutation(deleteQuery)


    useEffect( async() => {
        try{
        setload(true)
        const client = new ApolloClient({
        uri: "http://localhost:4000/graphql",
        cache: new InMemoryCache()
        })
          const { data } = await client.query({
            query: gql`
            query{
               getAll 
               {
                 id
                 Name
                 Email
                 Phone
                 Dob
                 Subjects
               }
             }
            `
          })
          console.log('data from studenttable', data.getAll );
          setInfo2(data.getAll)
          setload(false)
        }
        catch(err){
        setload(false)
        console.log('server err', err );
        }
    }, [])

    // add new subject

    const addSubjectbtn = ( v ) => {
        setObj(v)
        setModal(true);
        // console.log('on click', v );

    }

    const onDropdownclk = (clk) => {
        console.log('dropdown', clk);
        setInput(clk)
        // setadd( { ...add, subject: clk } )
    }


    const submitBtn = () => {
        
        let similar = curObj.Subjects.findIndex( x => x == input )
        console.log('input', input, 'curobj', curObj, 'similar', similar, 'concat', curObj.Subjects.concat(input) );

        if( similar < 0 && input != 'select' ){
            
            let updated = curObj.Subjects.concat(input)
            updated = updated.map(sub => sub.toUpperCase() )

            updateSubject({
                variables: {
                    id: curObj.id,
                    Subjects: updated
                }
            })
            console.log('posted');
            // let arr = [...info2];
            let arr = info2.map( x => { let newdata = {...x};  return newdata })
            console.log('arr info2', arr );
            for(let i in arr ){
                if(arr[i].Name == curObj.Name ){
                    console.log('arr[i]', arr[i] );
                    arr[i].Subjects = [...updated]
                    console.log('arr[]', arr[i] );
                }
            }
            setInfo2(arr);
            console.log('info2', info2, 'arr', arr ); 
            // window.location.reload();
            
            setModal(false)
        }
        else{
            alert(' You didn\'t add anything or This Subject is already in the list');
        }
    }


    // console.log(data.getAll);

     // add new student

     const newstuBtn = () => {
        setadd({});
        setModal2(true)
     }

     const oncreateNew = (e) => {
        e.preventDefault();
        console.log('new student info', add );
        let isSelect = add.subject.findIndex(x => x == 'select');

        if(add.name != undefined && add.email != undefined && add.phone != undefined && add.dob != undefined && add.subject != undefined && isSelect < 0 ){

            if (!Number(add.phone)) {
                alert("Your phone must be a number");
            }
            else{
                createPost({
                    variables: {
                        Name: add.name,
                        Email: add.email,
                        Phone: add.phone,
                        Dob: add.dob,
                        Subjects: add.subject
                    }
                })
                setModal2(false)

                // let arr = info2;
                let arr = info2.map( x => { let newdata = {...x};  return newdata })
                arr.push({ Name: add.name, Email: add.email, Phone: add.phone, Dob: add.dob, Subjects: add.subject });
                setInfo2(arr);
                console.log('arrr', arr, 'info2', info2 );
                setFields( [{ value: null }] )
            }
        }
        else{
            alert('You must fill full form')
        }            
    }

    const onClosenewstumodal = () => {
        setModal2(false)
        setFields( [{ value: null }] )
    }

    const handleChange = (i, e) => {
        // setInput(e)
        let values = [...fields];
        // let similar = values.findIndex( x => x == e.target.value )
        // if(similar < 0  ){
            values[i].value = e;   
            setFields(values);
            let arr = values.map(x => x.value )
            setadd( { ...add, subject: arr })

            // }
            // else{
                //     alert(' you can\'t add a subject more than one time ')
                // }
                
        console.log('field val', values, 'add', add, 'arr', arr );
    }
    
    const handleAdd = () => {
        const values = [...fields];
        console.log('values lenght', values.length );
        if( values.length < 8 ){
            values.push({ value: null });
            setFields(values);
        }
        else{
            alert('Total Subject is 8 , you can\'t add more field' )
        }
        console.log('handle add', values );
      }
    
    const handleRemove = (i) => {
        const values = [...fields];
        if(i >   0){
            values.splice(i, 1);
            setFields(values);
        }
        else{
            alert('you must add a subject')
        }
        console.log('handle remove', values );
      }

    // delete

    const deletebtn = (v) => {
        setModal3(true)
        setDelinfo(v)
    }

    const delData = () => {
        console.log('delete', delInfo );
        deletePost({
            variables: {
                id: delInfo.id
            }
        })        
        // let arr = info2;
        let arr = info2.map( x => { let newdata = {...x};  return newdata })
        let index = arr.findIndex(x => x.id == delInfo.id )
        let remove = arr.splice(index,1);
        setInfo2(arr);
        console.log('arr', arr, 'remove', remove, 'info2', info2 );
        setModal3(false);
    }

    //subject delete

    const delSubjectbtn = (x,v) => {
        console.log('x', x, 'v', v );
        setDelsub( {deletesub: x, from: v  })
        setModal4(true);
    }

    const delSubject = () => {
        console.log('delete subject', delsub );
        let arr = [...delsub.from.Subjects]
        let delindex = arr.findIndex(x => x == delsub.deletesub )
        console.log('arr', arr, 'del index', delindex ,  );
        let remove = arr.splice(delindex, 1 )
        
        updateSubject({
            variables: {
                id: delsub.from.id ,
                Subjects: arr
            }
        })

        // let arr2 = [...info2];
        let arr2 = info2.map( x => { let newdata = {...x};  return newdata })
        for(let i in arr2 ){
            if(arr2[i].id == delsub.from.id ){
                arr2[i].Subjects = arr
            }
        }
        setInfo2(arr2);
        setModal4(false)

        console.log('arr', arr, 'info2', info2 );
    }

    // subject table function

    const [toSubject, setTosubject] = useState(info2);
    const [ subject, setSubject ] = useState([]);

    console.log('to subject', toSubject );

    useEffect(() => {
        
    // setTimeout(() => {
    //     console.log('run after 2 second')
        setTosubject(info2);
        let arr = [];
        let subjectarr = toSubject.map((v) => v.Subjects )
        console.log('subjectarr', subjectarr );
        subjectarr.map((x) =>  x.map(y =>  arr.push(y) ) )
        // setSubject( subject.push(subjectarr) )
        // subjectarr.slice().sort().every(function(value, index) {
        //     console.log( value, value ===  subject.slice().sort()[index] ) 
        // });
        arr = [...new Set(arr)];
        console.log('arr', arr );
        let subarr = [];
        let info3 = toSubject.map( x =>{ let newdata = {...x}; return newdata })
        console.log('info3', info3, 'tosubject', toSubject  );
        for(let i in info3){
            for(let j in  info3[i].Subjects ){
                // console.log('inside for loop', info3[i].Subjects[j], info3[i].Name, arr.map(i => i ) );
                let subname = info3[i].Subjects[j];
                if( arr.map(i => i == subname )  ){
                    // console.log('matched sub ', info3[i].Subjects[j], info3[i].Name  );

                        let similar = subarr.findIndex(x => x.subject == subname );

                        if( similar >= 0 ){
                            // console.log('matched subject');
                            subarr[similar].student.push(info3[i].Name)
                        }
                        else{
                            //  console.log('not matched subject');
                            subarr.push( { subject: info3[i].Subjects[j], student: [ info3[i].Name ] } )
                        }
                    
                }
            }
        }
        setSubject(subarr);
        console.log( 'subarr', subarr );

    // }, 2000);
    }, [ modal, modal2, modal3, modal4, toSubject ])

   
    if(load === true) return 'Loading';
    return (
        <div style={{ position: 'relative' }} className={styles.tablediv} >
            <h1 style={{ color: 'darkcyan', textAlign: 'center' }} > Student Table </h1>
            <div style={{ boxShadow: '0 0 4px 2px rgba(0,0,0,.2)' }} >
            <button className={styles.addnew} onClick={ () => newstuBtn() } > Add New student </button>
            <table  >
                <thead>
                <tr>
                    <td> Name </td>
                    <td> Email </td>
                    <td> Phone </td>
                    <td> Date of Birth </td>
                    <td> Subjects </td>

                </tr>
                </thead>
                <tbody>
            {
                info2?.map((v,i) => 
                (
                        <tr key={i} >
                            <td> {v.Name} </td>
                            <td> {v.Email} </td>
                            <td> {v.Phone} </td>
                            <td> {v.Dob} </td>
                            <td style={{ display: 'flex' }} > 
                            {v.Subjects.map( (x,i) => 
                            <div key={i} style={{ display: 'flex', alignItems: 'center' }} > 
                            <div> {x} </div>   
                            <button className={styles.cross} onClick={() => delSubjectbtn(x,v) } > x </button> 
                            </div> )} 
                            </td>
                            <td className={styles.btn} > <button style={{ cursor: 'pointer' }} onClick={ () => addSubjectbtn(v) } > Add Subjects </button> </td>
                            <td  className={styles.btn2} onClick={() => deletebtn(v) } > Delete </td>
                        </tr>
                 ) )
            }          
            </tbody>  
            </table>
            
            {
                modal &&
                <div  className={styles.modal}  >
                    <h2 style={{ color: 'darkcyan' }} > Add Subjects </h2>
                    <div className={ styles.modalinner } >
                    {/* <SubjectDropdown setInput={setInput} setadd={setadd} add={add}  /> */}
                    <div className={styles.dropdown} >
                    <select name="selectList" id="selectList"  onClick={ (e) =>  onDropdownclk(e.target.value) }  >
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
                    {/* <input placeholder="write Subjects Here" onChange={ (e) => setInput(e.target.value)  } /> */}
                    <button onClick={ () => submitBtn() }  style={{ width: '20%', marginTop: '20px' }} > Submit </button>
                    <button onClick={ () => setModal(false) } style={{ width: '20%', marginBottom: '50px' }} > Close </button>
                    </div>
                </div>
            }

            {
                modal2 &&
                <div  className={styles.modal}  >
                    <h2 style={{ color: 'darkcyan' }} > Add New Student </h2>
                    <div className={ styles.modalinner } >
                    <form onSubmit={oncreateNew} style={{ display: 'grid' }} >
                    <input placeholder="write student name"  onChange={ (e) => setadd({...add, name: e.target.value })  } />
                    <input placeholder="write student Email" type="email"  onChange={ (e) => setadd({...add, email: e.target.value })  } />
                    <input placeholder="write student Phone No."   onChange={ (e) => setadd({...add, phone: e.target.value })  } />
                    <input type="date"  onChange={ (e) => setadd({...add, dob: e.target.value })  } />
                    {/* <SubjectDropdown setadd={setadd} setInput={setInput} add={add} /> */}
                    {/* <SubjectDropdown setadd={setadd} setInput={setInput} add={add}  handleChange={handleChange} idx={idx}  /> */}
                    {fields.map((field, idx) => {
                        return (
                            <div key={`${field}-${idx}`} style={{ display: 'flex', alignItems: 'baseline' }} >
                            <SubjectDropdown setadd={setadd} setInput={setInput} add={add}  handleChange={handleChange} idx={idx}  />
                            <button type="button" onClick={() => handleRemove(idx)}  style={{ height: '20px', margin: '0 5px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '.2rem', boxShadow: '0 0 5px 2px rgba(0,0,0,.3)', cursor: 'pointer' }} > X </button>
                        </div>
                        );
                    })}
                    <button type="button" onClick={() => handleAdd()}  style={{ width: '6rem', backgroundColor: 'darkslategray' }} > Add new + </button>
                    <button type="submit" style={{ backgroundColor: 'darkcyan' }} > Submit </button>
                    <button onClick={ () =>  onClosenewstumodal()    } > Close </button>
                    </form>
                    </div>
                </div>
            }

            {
                modal3 &&
                <div  className={styles.modal}  >
                    <div className={ styles.modalinner } >
                    <h2 style={{ color: 'darkcyan' }} > Do you want to delete this Data Row ? </h2>
                    <button onClick={ () => delData() } style={{ width: '20%', marginTop: '20px', backgroundColor: 'red' }}  > Yes </button>
                    <button onClick={ () => setModal3(false) } style={{ width: '20%', marginBottom: '50px' }}  > No </button>
                    </div>
                </div>
            }

            {
                modal4 &&
                <div  className={styles.modal}  >
                    <div className={ styles.modalinner } >
                    <h2 style={{ color: 'darkcyan' }} > Do you want to delete this Subject ? </h2>
                    <button onClick={ () => delSubject() } style={{ width: '20%', marginTop: '20px', backgroundColor: 'red' }} > Yes </button>
                    <button onClick={ () => setModal4(false) } style={{ width: '20%', marginBottom: '50px' }} > No </button>
                    </div>
                </div>
            }


            </div>
            <SubjectTable subject={ subject }  />
            
        </div>
    );
};

export default StudentTable;