import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Navbar from "../components/NavBar";
import Sidenav from "../components/SideNav";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";

interface UserResponse {
    id: number;
    username: string;
    email: string;
  }
  
  interface CarResponse {
    id: number;
    car_name: string;
    car_categories: string;
    car_size: string;
    status_rental: string;
    car_img: string;
    created_by: UserResponse;
    create_at?: Date;
  }

const cars_api_base_url: string = "http://localhost:8080";

export default function DashBoardForm() {
    const [cars, setCars] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  useEffect(() => {
    //akan di running pertama kali saat halaman di load
    const fetchCars = async () => {
      const response = await fetch(cars_api_base_url + "/api/cars");
      const responseJSON = await response.json();

      console.log("response", responseJSON);
      setCars(responseJSON.data.cars);
    };

    const checkIsLoggedIn = () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) setIsLoggedIn(true);
      else setIsLoggedIn(false);
    };

    fetchCars();
    checkIsLoggedIn();
  }, []);

  const deleteCar = async (carId: any) => {
    try {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        // Handle the case when the user is not logged in
        console.error("User not logged in");
        return;
      }
      setCarToDelete(carId);
      setShowAlert(true);
    } catch (error: any) {
      console.error("Error deleting car:", error.message);
    }
  };

  const handleConfirmation = async (confirmed: boolean) => {
    setShowAlert(false);

    if (confirmed) {
      try {
        const accessToken = localStorage.getItem("access_token");

        if (!accessToken) {
          console.error("User not logged in");
          return;
        }
        const response = await fetch(
          cars_api_base_url + "/api/cars/" + carToDelete,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          // Update the state to reflect the changes after successful deletion
          setCars((prevCars) =>
            prevCars.filter((car: CarResponse) => car.id !== carToDelete)
          );
        } else {
          // Handle errors if the deletion fails
          console.error("Failed to delete car:", response.statusText);
        }
      } catch (error: any) {
        console.error("Error deleting car:", error.message);
      }
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("email");

    setIsLoggedIn(false);
  };

  return (
    <div className="flex  min-h-fit">
      <Sidenav />

      <div className={`flex flex-col w-full  ${isSidebarOpen}`}>
        <Navbar
          onSidebarToggle={toggleSidebar}
          isLoggedIn={isLoggedIn}
          onLogout={logoutHandler}
        />

        <div className="main-content flex h-full  ">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="content grid w-full  bg-gray-100 px-6 pt-9 ">
            <div className="grid">
              <div className=" flex py-2 align-middle  max-w-fit pl-6">
                <div className="shadow overflow-hidden h-fit border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Size
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Categories
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status Rental
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Create by
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Edit
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Delete
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cars.map((car: CarResponse) => (
                        <tr key={car.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {car.car_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {car.car_size}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {car.car_categories}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {car.status_rental}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-left">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {car.created_by.username}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <button className="text-green-500 hover:text-green-700">
                              <Link
                                to={`/update-car/${car.id}`}
                                className="inline-flex font-bold justify-center"
                              >
                                Edit
                              </Link>
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deleteCar(car.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showAlert && (
          <Alert
            onConfirm={() => handleConfirmation(true)}
            onCancel={() => handleConfirmation(false)}
          />
        )}
      </div>
    </div>
  )
}
