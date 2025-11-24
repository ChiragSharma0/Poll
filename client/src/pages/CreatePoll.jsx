import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function CreatePollPage() {
  const { createPoll } = useContext(AuthContext);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [pollImage, setPollImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", question);
      options.forEach((opt) => opt && formData.append("options", opt));
      if (pollImage) formData.append("image", pollImage);

      const res = await createPoll(formData);

      if (res.success) {
        alert("Poll created successfully!");
        setQuestion("");
        setOptions(["", ""]);
        setPollImage(null);
      } else {
        alert(res.message || "Failed to create poll.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating poll!");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-center mb-6">Create a New Poll</h2>

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-xl rounded-2xl">
        <div>
          <label className="block mb-2 font-semibold">Poll Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className="w-full border p-3 rounded-xl"
            placeholder="Type your question..."
          />
        </div>

        <div className="mt-5">
          <label className="block mb-2 font-semibold">Options</label>
          {options.map((opt, index) => (
            <input
              key={index}
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required={index < 2}
              className="w-full border p-3 rounded-xl mb-3"
              placeholder={`Option ${index + 1}`}
            />
          ))}
          <button type="button" onClick={addOption} className="text-blue-600 font-medium">
            + Add More Options
          </button>
        </div>

        <div className="mt-5">
          <label className="block mb-2 font-semibold">Poll Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e) => setPollImage(e.target.files[0])} />
          {pollImage && (
            <img
              src={URL.createObjectURL(pollImage)}
              alt="Preview"
              className="mt-4 w-48 h-48 object-cover rounded-xl shadow"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>
      </form>
    </div>
  );
}
