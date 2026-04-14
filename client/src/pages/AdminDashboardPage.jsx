import { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiPlus, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

import GlassCard from "../components/ui/GlassCard";
import Skeleton from "../components/ui/Skeleton";
import StatusBadge from "../components/ui/StatusBadge";
import AdminStats from "../components/admin/AdminStats";
import { useAuth } from "../contexts/AuthContext";
import * as projectService from "../services/projectService";
import * as skillService from "../services/skillService";
import * as messageService from "../services/messageService";

const formatRelativeDate = (dateString) => {
  const now = Date.now();
  const diff = now - new Date(dateString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateString).toLocaleDateString();
};

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [projectsRes, skillsRes, messagesRes] = await Promise.all([
        projectService.getAdminProjects(),
        skillService.getSkills(),
        messageService.getMessages(),
      ]);
      setProjects(projectsRes.data?.data || []);
      setSkills(skillsRes.data?.data || []);
      setMessages(messagesRes.data?.data || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
    [projects]
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-dark-50">Dashboard</h1>
        <p className="text-dark-400 mt-1">
          Welcome back{user?.email ? `, ${user.email}` : ""}! 👋
        </p>
      </div>

      {/* Error State */}
      {!isLoading && error && (
        <GlassCard className="text-center py-12 mt-6 mb-8">
          <FiAlertCircle className="mx-auto text-red-400 mb-4" size={40} />
          <p className="text-red-400 mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white text-sm px-5 py-2.5 rounded-lg transition-colors"
          >
            <FiRefreshCw size={14} />
            Retry
          </button>
        </GlassCard>
      )}

      {/* Stats Cards */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 mt-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-6">
          <AdminStats projects={projects} skills={skills} messages={messages} />
        </div>
      )}

      {/* Quick Actions */}
      {!error && (
        <div className="flex gap-3 mb-8">
          <Link
            to="/admin/projects?action=new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            New Project
          </Link>
          <Link
            to="/admin/skills?action=new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dark-600 text-dark-200 font-medium text-sm hover:bg-dark-800 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            New Skill
          </Link>
        </div>
      )}

      {/* Recent Projects */}
      {isLoading && (
        <GlassCard>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </GlassCard>
      )}

      {!isLoading && !error && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-dark-50">
              Recent Projects
            </h2>
            <Link
              to="/admin/projects"
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-dark-400 mb-4">No projects yet</p>
              <Link
                to="/admin/projects?action=new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                Create First Project
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-dark-800/50">
              {recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg hover:bg-dark-800/30 transition-colors"
                >
                  {project.image?.url ? (
                    <img
                      src={project.image.url}
                      alt={project.title}
                      className="w-8 h-8 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded bg-dark-700 shrink-0" />
                  )}

                  <span className="text-sm font-medium text-dark-100 truncate flex-1">
                    {project.title}
                  </span>

                  <StatusBadge status={project.status} />

                  <span className="text-xs text-dark-500 whitespace-nowrap">
                    {formatRelativeDate(project.updatedAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}
    </>
  );
};

export default AdminDashboardPage;
