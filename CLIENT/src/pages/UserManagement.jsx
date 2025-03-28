/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { NUMBER_OF_USERS_PER_PAGE } from "../constants";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Select from "../components/ui/Select";
import {
  Lock,
  Unlock,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Mail,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUpdateUser } from "../hooks/useUsers";

const UserManagement = () => {
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const { data } = useUsers(currentPage, NUMBER_OF_USERS_PER_PAGE);
  const users = data?.users || [];
  const { mutate: updateUser, isError, isPending, isSuccess } = useUpdateUser();
  const [roleChanges, setRoleChanges] = useState({});
  const navigate = useNavigate();

  const handleRoleChange = (userId, role) => {
    setRoleChanges({
      ...roleChanges,
      [userId]: role,
    });
  };
  const handleBlockToggle = (user) => {
    updateUser({
      userId: user._id,
      userData: { blocked: !user.blocked }, // Toggle blocked value
    });
  };
  const handleRoleSubmit = (userId) => {
    if (roleChanges[userId]) {
      updateUser(
        { userId, userData: { role: roleChanges[userId] } }, // Send only updated role
        {
          onSuccess: () => {
            setRoleChanges((prev) => {
              const newChanges = { ...prev };
              delete newChanges[userId]; // Clear change after successful update
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
      default:
        return "default";
    }
  };

  const totalPages = Math.ceil((data?.count ?? 0) / NUMBER_OF_USERS_PER_PAGE);
  const indexOfFirstUser = (currentPage - 1) * NUMBER_OF_USERS_PER_PAGE + 1;
  const indexOfLastUser = Math.min(
    currentPage * NUMBER_OF_USERS_PER_PAGE,
    data?.count ?? 0
  );
  const currentUsersCount = data?.users?.length ?? 0;
  const paginate = (pageNumber) => {
    const validPageNumber = Math.max(1, Math.min(pageNumber, totalPages));
    navigate(`/users?page=${validPageNumber}`);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      paginate(totalPages);
    } else if (currentPage < 1) {
      paginate(1);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="px-2 sm:px-4 py-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
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
                  User
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
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
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Select
                          options={[
                            { value: "admin", label: "Admin" },
                            { value: "validator", label: "Validator" },
                            { value: "user", label: "User" },
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
                            <span className="animate-pulse">Updating...</span>
                          ) : (
                            <>
                              <UserCog className="h-4 w-4" />
                              <span className="hidden lg:inline ml-1">
                                Update
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
                      {user.blocked ? "Blocked" : "Active"}
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
                          <span className="animate-pulse">Unblocking...</span>
                        ) : (
                          <>
                            <Unlock className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Unblock</span>
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
                          <span className="animate-pulse">Blocking...</span>
                        ) : (
                          <>
                            <Lock className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Block</span>
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

        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-20"
            >
              Previous
            </Button>
            <span className="mx-4 flex items-center text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-20"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {currentUsersCount > 0 ? indexOfFirstUser : 0}
                </span>
                to{" "}
                <span className="font-medium">
                  {currentUsersCount > 0 ? indexOfLastUser : 0}
                </span>
                of <span className="font-medium">{data?.count ?? 0}</span>{" "}
                results
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
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "primary" : "outline"}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === index + 1
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
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
      </div>
    </div>
  );
};

export default UserManagement;
