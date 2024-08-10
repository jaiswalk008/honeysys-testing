import { useNavigate } from 'react-router-dom';
import Toast from '../components/common/Toasts';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const generateAccessToken = async (clientId, clientSecret) => {
  const resp = await fetch(`${process.env.REACT_APP_API_KEY}/auth/token_generation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  return await resp.json();
};

export default function Login() {
  const navigate = useNavigate();

  const [clientId, setClientId] = useState(localStorage.getItem('clientId'));
  const [clientSecret, setClientSecret] = useState(localStorage.getItem('clientSecret'));
  const [token, setToken] = useState(localStorage.getItem('AccessToken'));
  useEffect(() => {
    setToken(localStorage.getItem('AccessToken'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await generateAccessToken(clientId, clientSecret);
      if (token.failed) {
        toast.error(<Toast text={`${token.message}`} color="red" />);
        return;
      }

      setToken(token.access_token.toString());
      localStorage.setItem('AccessToken', token.access_token.toString());
      localStorage.setItem('clientId', clientId);
      localStorage.setItem('clientSecret', clientSecret);
      toast(<Toast text="Access token saved" color="success" />);
      navigate('/home');
    } catch (error) {
      toast(<Toast text={`${error}`} color="red" />);
    }
  };

  return (
    <>
      <section className="flex justify-center items-center w-screen h-full bg-[#F4FDFF] font-Poppins ">
        <div className="w-full md:px-32 flex justify-center items-center px-10">
          <form
            // onSubmit={handleSubmit}
            className="flex flex-col gap-5 justify-center items-center bg-white rounded-xl p-8 w-full border-[#616161] max-w-[45rem]   -translate-y-8  border"
            style={{ boxShadow: ' 8px 8px 16px -4px rgba(0, 0, 0, 0.12)' }}
          >
            <div className="flex flex-col justify-center items-center w-full ">
              <h1 className="text-[#2F99C1] text-[2.30rem] font-bold py-1">Client Data</h1>
              <h2 className="text-xl font-normal text-[#616161]">Enter client's data to proceed</h2>
            </div>
            <div className="flex flex-col items-start gap-3  justify-center w-full ">
              <input
                type="text"
                placeholder="Enter Client Id"
                className="bg-white w-full rounded-lg outline-none border-[#DADADA] border px-10  text-xl py-6"
                style={{ boxShadow: '8px 8px 16px -4px rgba(0, 0, 0, 0.12)' }}
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
              <input
                type="text"
                placeholder="Enter Client Secret"
                className="bg-white  w-full rounded-lg outline-none border-[#DADADA] border px-10 text-xl  py-6"
                style={{ boxShadow: '8px 8px 16px -4px rgba(0, 0, 0, 0.12)' }}
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
            </div>
            <div>
              <button
                className="text-white bg-[#2F99C1] py-2 px-8 rounded-lg"
                style={{ boxShadow: ' 8px 8px 16px -4px rgba(0, 0, 0, 0.12)' }}
                disabled={clientId === '' || clientSecret === ''}
                onClick={handleSubmit}
              >
                {localStorage.getItem('clientSecret') ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
