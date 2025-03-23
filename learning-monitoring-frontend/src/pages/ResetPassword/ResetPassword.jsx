import React, { useContext, useState, useEffect, useRef } from "react";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { UserContext } from "../../contexts/UserContext/UserContext";
import bcrypt from "bcryptjs";
import { getData, postData } from "../../services/axios";
import { useNavigate } from "react-router-dom";
import logo from "./../../styles/logo.png";
import { Avatar } from "primereact/avatar";
import { Toast } from 'primereact/toast';
import "./ResetPassword.css";
import { validateUser } from "../../validations/client-validation";

const ResetPassword = () => {
  const [randomPassword, setRandomPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const navigate = useNavigate();
  const toast = useRef(null);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const condition = `email = '${user.email}'`;
        const response = await getData("user/read", { condition: condition });
        if (response.status === 200) {
          if (response.data.length === 1) {
            const res = response.data.filter((e) => e.email === user.email);
            setUserDetails(res);
            const pass = generateRandomPassword();
            await postData("auth/resetPassword", {
              recipient: res[0].email,
              subject: "איפוס סיסמה",
              body: ` ${pass} : הכנס סיסמה זמנית כדי לאפס סיסמה `,
            });
          }
        } else {
          console.log("The connection failed");
        }
      } catch (error) {
        console.error("An error occurred", error);
      }
    };

    fetchData();
  }, []);

  const generateRandomPassword = () => {
    const random = bcrypt.hashSync(Math.random().toString(36).slice(2), 10);
    const numRan = Math.floor(Math.random() * 60);
    const pass = random.slice(numRan - 6, numRan);
    setRandomPassword(pass);
    console.log(pass)
    return pass;
  };
  const confirm = async () => {
    if (password === randomPassword && confirmPassword) {
      const dataToUpdate = {
        id: userDetails[0].id,
        password: confirmPassword,
      };

      let validateFlag = true;
      const res = validateUser(dataToUpdate, 'reset-password')
      if (res != null) {
        await res.then((notifications) => {
          const value = notifications['password'];
          if (value != '') {
            validateFlag = false;
            toast.current.show({ severity: 'error', summary: 'שגיאה', detail: value, life: 5000 })
          }
        }).catch((error) => {
          console.log("error ", error);
        });
      }

      if (validateFlag) {
        const response = await postData('user/update', dataToUpdate);
        if (response.status === 200) {
          console.log("סיסמה מצוינת");
          navigate("/");
        }
      }

    } else {
      toast.current.show({ severity: 'error', summary: 'שגיאה', detail: 'סיסמה שהוכנסה מהמייל שגויה', life: 5000 })
      console.log("סיסמה שגויה");
    }
  };


  const signOut = () => {
    navigate('/');
    setUser(undefined);
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="login-page side">
        <aside id="right">
          <img src={logo} alt="Logo" />
        </aside>
        <aside id="left">
          {<h1>ברוכה הבאה!</h1>}
          {<p id="p">אנא מלאי את השדות לאפס סיסמה</p>}
          <div className="panel">
            <div className="card flex flex-column md:flex-row gap-3 input-icon">
              <div className="p-inputgroup flex-1" id="w">
                <span className="p-inputgroup-addon" id="sp">
                  <i className="pi pi-key"></i>
                </span>
                <InputText
                  id="password"
                  placeholder="הכנס סיסמה מהמייל"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="card flex flex-column md:flex-row gap-3 input-icon">
              <div className="p-inputgroup flex-1" id="w">
                <span className="p-inputgroup-addon" id="sp">
                  <i className="pi pi-key"></i>
                </span>
                <InputText
                  id="new_password"
                  type="password"
                  placeholder=" הכנס סיסמה חדשה"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="button">
              {<Avatar label="אימות" id="confirm" onClick={confirm} />}
            </div>
          </div>
        </aside>
        <div className="div-sign-out-reset-password">
          <Button className="sign-out-reset-password" icon="pi pi-sign-out" onClick={signOut} />

        </div>
      </div>
    </>
  );
};

export default ResetPassword;
