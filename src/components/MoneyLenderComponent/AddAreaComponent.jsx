import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Navbar from "./Navbar";
const API_BASE_URL ="https://tagada.onrender.com";

const AddAreaComponent = () => {
  const [profile, setProfile] = useState(null);
  const [areas, setAreas] = useState([""]); // For adding new areas
  const [currentAreas, setCurrentAreas] = useState([]); // Current areas from the database
  const [editAreas, setEditAreas] = useState({}); // For editing area names
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedAreas, setSelectedAreas] = useState([]); // For selecting areas to delete
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAreas, setFilteredAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch profile data to get MoneyLenderId
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/profile/user`, {
          withCredentials: true,
        });
        console.log("Response Data:", response.data);
        setProfile(response.data.user);
        console.log("Profile Data:", response.data.user);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch current areas
  useEffect(() => {
    const fetchAreas = async () => {
      if (!profile || !profile.uid) return;
      try {
        const response = await axios.get(
          `${API_BASE_URL}/moneylender/get-areas/${profile.uid}`
        );
        const fetchedAreas = response.data.areas || [];
        setCurrentAreas(fetchedAreas);
        setFilteredAreas(fetchedAreas);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch areas");
        setCurrentAreas([]);
        setFilteredAreas([]);
      }
    };
    if (profile) fetchAreas();
  }, [profile]);

  // Handle search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = currentAreas.filter((area) =>
      area.toLowerCase().includes(term)
    );
    setFilteredAreas(filtered);
  };

  // Handle input change for adding new areas
  const handleAreaChange = (index, value) => {
    const newAreas = [...areas];
    newAreas[index] = value;
    setAreas(newAreas);
  };

  // Add a new area input field
  const handleAddAreaComponentInput = () => {
    setAreas([...areas, ""]);
  };

  // Handle form submission to add new areas
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Filter out empty areas
    const filteredAreas = areas.filter((area) => area.trim() !== "");
    if (filteredAreas.length === 0) {
      setError("Please add at least one area");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/moneylender/add-area/${profile.uid}`,
        { newAreas: filteredAreas },
        { withCredentials: true }
      );
      setSuccess(response.data.message || "Areas added successfully");
      setAreas([""]); // Reset to one empty field after success
      // Update current areas
      const updatedAreas = [...currentAreas, ...filteredAreas];
      setCurrentAreas(updatedAreas);
      setFilteredAreas(updatedAreas);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add areas");
    }
  };

  // Handle selecting areas for deletion
  const handleSelectArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  // Handle deleting selected areas
  const handleDeleteAreas = async () => {
    if (selectedAreas.length === 0) {
      setError("Please select at least one area to delete");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/moneylender/delete-area/${profile.uid}`,
        { areasToDelete: selectedAreas },
        { withCredentials: true }
      );
      setSuccess(response.data.message || "Areas deleted successfully");
      const updatedAreas = currentAreas.filter(
        (area) => !selectedAreas.includes(area)
      );
      setCurrentAreas(updatedAreas);
      setFilteredAreas(updatedAreas);
      setSelectedAreas([]); // Reset selection
    } catch (err) {
      if (err.response?.data?.blockedAreas) {
        setError(
          `Cannot delete the following areas due to active loans: ${err.response.data.blockedAreas.join(", ")}`
        );
      } else {
        setError(err.response?.data?.error || "Failed to delete areas");
      }
    }
  };

  // Handle editing area names
  const handleEditChange = (area, value) => {
    setEditAreas((prev) => ({
      ...prev,
      [area]: value,
    }));
  };

  // Handle saving edited area names
  const handleUpdateAreas = async () => {
    const updates = Object.keys(editAreas).map((oldArea) => ({
      oldArea,
      newArea: editAreas[oldArea],
    }));

    if (updates.length === 0) {
      setError("No areas to update");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/moneylender/update-area/${profile.uid}`,
        { updates },
        { withCredentials: true }
      );
      setSuccess(response.data.message || "Areas updated successfully");
      // Update current areas with new names
      const updatedAreas = currentAreas.map((area) => editAreas[area] || area);
      setCurrentAreas(updatedAreas);
      setFilteredAreas(updatedAreas);
      setEditAreas({}); // Reset edit state
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update areas");
    }
  };

  if (loading) return <div className="p-8 text-gray-600">Loading data...</div>;
  if (error && !profile)
    return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar profile={profile || {}} />
      <main className="mt-14 p-4 max-w-8xl mx-auto min-h-screen">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Manage Areas
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mb-4">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search areas..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Areas List */}
          <div className="space-y-2 mb-4">
            {filteredAreas.length === 0 ? (
              <p className="text-gray-500">No areas added yet.</p>
            ) : (
              filteredAreas.map((area, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedAreas.includes(area)}
                      onChange={() => handleSelectArea(area)}
                      className="mr-2"
                    />
                    {editAreas[area] !== undefined ? (
                      <input
                        type="text"
                        value={editAreas[area]}
                        onChange={(e) => handleEditChange(area, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    ) : (
                      <span className="text-gray-700">{area}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setEditAreas((prev) => ({ ...prev, [area]: area }))
                      }
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={handleDeleteAreas}
                      className="text-red-600 hover:text-red-800"
                      disabled={selectedAreas.length === 0}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Update Areas Button */}
          {Object.keys(editAreas).length > 0 && (
            <button
              onClick={handleUpdateAreas}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg mb-4 hover:bg-blue-600"
            >
              Save Changes
            </button>
          )}

          {/* Add New Areas */}
          <form onSubmit={handleSubmit}>
            {areas.map((area, index) => (
              <div key={index} className="mb-4 flex items-center">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => handleAreaChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Enter Area ${index + 1}`}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddAreaComponentInput}
              className="mb-4 w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600"
            >
              + Add More Area
            </button>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-lg flex items-center justify-center"
            >
              Add New Area
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddAreaComponent;