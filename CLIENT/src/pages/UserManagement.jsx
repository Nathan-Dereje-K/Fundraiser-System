import { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { NUMBER_OF_USERS_PER_PAGE } from "../constants";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Select from "../components/ui/Select";
import {
  Lock,
  Unlock,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Mail,
  Search,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useUpdateUser } from "../hooks/useUsers";
import { useTranslation } from "react-i18next";

const UserManagement = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const { data } = useUsers(currentPage, NUMBER_OF_USERS_PER_PAGE, searchTerm);
  const users = data?.users || [];
  const filteredCount = data?.count || 0;
  const totalPages = data?.totalPages || 1;
  const { mutate: updateUser, isError, isPending, isSuccess } = useUpdateUser();
  const [roleChanges, setRoleChanges] = useState({});

  const handleRoleChange = (userId, role) => {
    setRoleChanges({
      ...roleChanges,
      [userId]: role,
    });
  };

  const handleBlockToggle = (user) => {
    updateUser({
      userId: user._id,
      userData: { blocked: !user.blocked },
    });
  };

  const handleRoleSubmit = (userId) => {
    if (roleChanges[userId]) {
      updateUser(
        { userId, userData: { role: roleChanges[userId] } },
        {
          onSuccess: () => {
            setRoleChanges((prev) => {
              const newChanges = { ...prev };
              delete newChanges[userId];
              return newChanges;
            });
          },
        }
      );
    }
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      case "validator":
        return "warning";
      case "manager":
        return "warning";
      default:
        return "default";
    }
  };

  const currentUsersCount = users.length;
  const indexOfFirstUser =
    currentUsersCount > 0
      ? (currentPage - 1) * NUMBER_OF_USERS_PER_PAGE + 1
      : 0;
  const indexOfLastUser = indexOfFirstUser + currentUsersCount - 1;

  const paginate = (pageNumber) => {
    const validPageNumber = Math.max(1, Math.min(pageNumber, totalPages));
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", validPageNumber.toString());
    if (searchTerm) {
      newParams.set("search", searchTerm);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("search", value);
    } else {
      newParams.delete("search");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="px-2 sm:px-4 py-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("user_management")}
        </h1>
        <div className="relative">
          <Input
            placeholder={t("search_placeholder")}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-64"
            icon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("user")}
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  {t("role")}
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  {t("status")}
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                >
                  {t("created")}
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
                        <img
                          className="h-full w-full rounded-full"
                          src={user.avatar}
                          alt={user.name}
                          onError={(e) => {
                            const target = e.target;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              user.name
                            )}&background=random`;
                          }}
                        />
                      </div>
                      <div className="ml-2 sm:ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1 inline sm:hidden" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {t(`role_${user.role}`)}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Select
                          options={[
                            { value: "admin", label: t("role_admin") },
                            { value: "manager", label: t("role_manager") },
                            { value: "validator", label: t("role_validator") },
                            { value: "user", label: t("role_user") },
                          ]}
                          value={roleChanges[user._id] || user.role}
                          onChange={(value) =>
                            handleRoleChange(user._id, value)
                          }
                          className="text-sm w-32"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleRoleSubmit(user._id)}
                          disabled={
                            !roleChanges[user._id] ||
                            roleChanges[user._id] === user.role
                          }
                        >
                          {isPending && roleChanges[user._id] ? (
                            <span className="animate-pulse">
                              {t("updating")}...
                            </span>
                          ) : (
                            <>
                              <UserCog className="h-4 w-4" />
                              <span className="hidden lg:inline ml-1">
                                {t("update")}
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.blocked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.blocked ? t("blocked") : t("active")}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.blocked ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleBlockToggle(user)}
                        className="w-full sm:w-auto"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <span className="animate-pulse">
                            {t("unblocking")}...
                          </span>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">
                              {t("unblock")}
                            </span>
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleBlockToggle(user)}
                        className="w-full sm:w-auto"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <span className="animate-pulse">
                            {t("blocking")}...
                          </span>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">
                              {t("block")}
                            </span>
                          </>
                        )}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCount > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-20"
              >
                {t("previous")}
              </Button>
              <span className="mx-4 flex items-center text-sm text-gray-700">
                {t("page_info", {
                  current: currentPage,
                  total: totalPages,
                })}
              </span>
              <Button
                variant="outline"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-20"
              >
                {t("next")}
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  {t("showing_results", {
                    first: indexOfFirstUser,
                    last: indexOfLastUser,
                    total: filteredCount,
                  })}
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      if (pageNum === 1 || pageNum === totalPages) return true;
                      if (Math.abs(pageNum - currentPage) <= 1) return true;
                      return false;
                    })
                    .map((pageNum, idx, array) => {
                      if (idx > 0 && pageNum - array[idx - 1] > 1) {
                        return (
                          <React.Fragment key={`ellipsis-${pageNum}`}>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                            <Button
                              variant={
                                currentPage === pageNum ? "primary" : "outline"
                              }
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                              }`}
                              onClick={() => paginate(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          </React.Fragment>
                        );
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "primary" : "outline"
                          }
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}

                  <Button
                    variant="outline"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {filteredCount === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {t("no_users_found", { searchTerm })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;