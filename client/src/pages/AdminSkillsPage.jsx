import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { FiPlus } from "react-icons/fi";

import SkillTable from "../components/admin/SkillTable";
import SkillForm from "../components/admin/SkillForm";
import * as skillService from "../services/skillService";

const AdminSkillsPage = () => {
  const [searchParams] = useSearchParams();
  const [skills, setSkills] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSkills = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await skillService.getSkills();
      setSkills(res.data);
    } catch (error) {
      toast.error("Failed to load skills");
      console.error("Failed to fetch skills:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    if (searchParams.get("action") === "new") {
      setEditingSkill(null);
      setIsFormOpen(true);
    }
  }, [searchParams]);

  const handleAddNew = () => {
    setEditingSkill(null);
    setIsFormOpen(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setIsFormOpen(true);
  };

  const handleDelete = async (skillId) => {
    try {
      await skillService.deleteSkill(skillId);
      toast.success("Skill deleted");
      fetchSkills();
    } catch (error) {
      toast.error(error.message || "Failed to delete skill");
    }
  };

  return (
    <>
      <Helmet>
        <title>Skills | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-dark-50">Manage Skills</h1>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Add New Skill
        </button>
      </div>

      <SkillTable
        skills={skills}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddNew={handleAddNew}
      />

      <SkillForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSkill(null);
        }}
        editingSkill={editingSkill}
        onSuccess={fetchSkills}
      />
    </>
  );
};

export default AdminSkillsPage;
