import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {

  const [products, setProducts] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [test, setTest] = useState({
      update:[]
  });
  const [isLoading, setIsLoading] = useState(true);


  const username = 'ck_35f64c79ebe2cfd6979b6f81c103ff01135ae1b8'
  const password = 'cs_1dd3842d9bdc656ace99007faef0bb09a4d34400'
  const requestOptions = {
      method: 'GET',
      headers: {
          'Authorization': 'Basic ' + btoa(username + ":" + password)
      }
  };


  const requestOptions2 = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(username + ":" + password)
      },
      body: JSON.stringify(test)
  }


  useEffect(() => {
      fetch('https://demostore.mirailit.com/wp-json/wc/v3/products', requestOptions)
          .then(res => res.json())
          .then(data => {
            setProducts(data)
            setIsLoading(false)
          })
  }, []);


  const handlePrice = (e, row) => {

    console.log(row);

        let newUpdate = [...test.update];
        console.log('into',newUpdate);

        if (newUpdate.length > 0) {
            console.log('length > 0');
            
            let count = 0;
            newUpdate.map(item => {
                if (item.id === row.id) {
                    console.log("item match");
                    item.regular_price = e.target.value;
                    count = 1;
                }
            })
            if(count === 0){
                console.log('item not matching');
                let temp = { id: row.id, regular_price: e.target.value }
                newUpdate.push(temp)
            }
            
        } else {
            console.log("length = 0");
            let temp = { id: row.id, regular_price: e.target.value }
            newUpdate.push(temp)
        }

        setTest({update:newUpdate})

        

        const newProducts = [...products];
        newProducts.map((product) => {

            if (product.id === row.id) {
                product.price = e.target.value;
            }
        });
        setProducts(newProducts);
    }


  const submitData = () => {
        console.log('submit');
        fetch('https://demostore.mirailit.com/wp-json/wc/v3/products/batch' , requestOptions2)
        .then(res => res.json())
        .then(status => {
          alert('Price Updated Successfully');
          setIsDisabled(true);
        })
  }
  

  return (
    <div style={{ maxWidth:'800px', margin:'auto'}}>
        <div style={{ maxWidth: "90%", margin: 'auto', marginTop: '20px', display: 'flex',            
          alignItems:'center'}} className="custom-card">
            <div style={{flexGrow:'1'}}>
                <h2 style={{padding:'0px', marginLeft:'0px'}}>Product List</h2>
            </div>
            <div>
                <button 
                style={{padding:'14px', background:'blue', color:'white', fontWeight:'600', 
                fontSize:'16px', letterSpacing:'2px', border:'0px', 
                borderRadius:'4px', cursor:'pointer'}} 
                onClick={() => setIsDisabled(!isDisabled)}
                >Edit Price</button>
            </div>
        </div>
        
        
        <div style={{ maxWidth: "90%", margin:'auto', }}>
            <div style={{width:'100%'}}>
              <table>
                <tr>
                  <th style={{width:'50%', border:'1px solid'}}>Product name</th>
                  <th style={{width:'20%', border:'1px solid', textAlign:'center'}}>Image</th>
                  <th style={{width:'20%', border:'1px solid', textAlign:'center'}}>Price</th>
                </tr>
            {
              isLoading
                  ? <p style={{textAlign:'center', color:'red'}}>Loading ....</p>
                  :
                  products.length > 0 && products.map((item) => {
                    return <tr style={{borderBottom:'1px solid gray'}}>
                            <td style={{textAlign:'left'}}>{item.name}</td>
                            <td style={{height:'60px', textAlign:'center'}}><img style={{height:'100%'}} src={item.images[0].src} alt="" srcset="" /></td>
                            <td style={{textAlign:'center'}}><input 
                              type="number" 
                              value={item.price} 
                              style={{height:"35px", width:'80px', textAlign:'center'}} 
                              disabled={isDisabled}
                              onChange={(e) => handlePrice(e, item)}
                            /></td>
                          </tr>
                    })
                }
              </table>
            </div>
        </div>
        
        
        <div style={{ maxWidth: "90%", marginLeft:'40%',marginBottom:'20px',}}>
            <button 
                style={{padding:'14px', background:'blue', color:'white', fontWeight:'600', 
                fontSize:'16px', letterSpacing:'2px', border:'0px', 
                borderRadius:'4px', cursor:'pointer', marginTop:'16px'}} 
                onClick={submitData}
                >Submit Data</button>
        </div>
    </div>
  );
}

export default App;
