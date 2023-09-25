
const db=require('../../Entity')
const cities=db.location;
const sendDataToServer = async (req,res) => {

  try {
    const data=req.body.cityName;
    console.log("data",data);
      const newCity = await cities.create({city: data });
      res.send({message:"Data Inserted"})
    console.log('City inserted:', newCity);
    
  } catch (error) {
    console.error('Error inserting city:', error);
    res.send({message:"Error occured while inserting city"})
  }
}

const getdata=async(req,res)=>
{
  console.log("getdata");
  try{

    const places=await cities.findAll();
    console.log(places);
    res.send(places);
  }
  catch{
    console.log("error in fetching places");
  }
}
module.exports = {
  sendDataToServer,getdata
};
