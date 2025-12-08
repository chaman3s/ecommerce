import { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ADDRESSES, ADD_ADDRESS } from "../graphql/address";

export default function AddressBook() {

  const { data, loading, refetch } = useQuery(GET_ADDRESSES, {
    fetchPolicy: "network-only"
  });

  const [addAddress] = useMutation(ADD_ADDRESS);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  // Add address to backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addAddress({ variables: { input: form } });
      setForm({ name:"",phone:"",street:"",city:"",state:"",zip:"" });
      refetch();    // refresh UI
    } catch (err) {
      alert(err.message);
    }
  };

  const AddressSkeleton = () => (
    <Card className="border p-4 mb-3">
      <Skeleton className="w-40 h-4 mb-2" />
      <Skeleton className="w-28 h-4 mb-2" />
      <Skeleton className="w-56 h-4 mb-2" />
      <Skeleton className="w-20 h-8" />
    </Card>
  );

  // Must login first
  if (!localStorage.getItem("token"))
    return <h2 className="text-center mt-20 text-xl text-red-500">Please Login to continue</h2>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📍 Address Book</h2>

      {/* Add Form */}
      <Card className="border p-5 mb-6">
        <h3 className="font-semibold text-lg mb-3">Add New Address</h3>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <Input placeholder="Full Name"
            value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />

          <Input type="number" placeholder="Phone Number"
            value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />

          <Input className="md:col-span-2" placeholder="Street Address"
            value={form.street} onChange={(e)=>setForm({...form,street:e.target.value})} />

          <Input placeholder="City"
            value={form.city} onChange={(e)=>setForm({...form,city:e.target.value})} />

          <Input placeholder="State"
            value={form.state} onChange={(e)=>setForm({...form,state:e.target.value})} />

          <Input placeholder="Zip Code"
            value={form.zip} onChange={(e)=>setForm({...form,zip:e.target.value})} />

          <Button className="md:col-span-2 mt-2" type="submit">Save Address</Button>
        </form>
      </Card>

      {loading && (<><AddressSkeleton /><AddressSkeleton /></>)}

      {/* No addresses */}
      {!loading && data?.getAddresses?.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          <img src="https://cdn-icons-png.flaticon.com/512/6598/6598519.png"
            className="w-28 mx-auto opacity-70 mb-3" />
          <p>No saved addresses yet.</p>
          <p className="text-sm">Add one using the form above.</p>
        </div>
      )}

      {/* Address List */}
      <div className="grid gap-4">
        {data?.getAddresses?.map((a,i)=>(
          <Card key={i} className="border p-4">
            <CardContent>
              <h4 className="text-lg font-bold">{a.name}</h4>
              <p className="text-sm">{a.phone}</p>
              <p>{a.street}, {a.city}, {a.state} - {a.zip}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
