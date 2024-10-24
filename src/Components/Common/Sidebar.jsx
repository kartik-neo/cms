import React, { useEffect, useState } from "react";
import {NavLink } from "react-router-dom";
import {BsXLg } from "react-icons/bs";
import { IoHomeSharp } from "react-icons/io5";
import { fetchMenuList, fetchMenuGroup } from "../../Services/external";
import { getGroupedMenu } from "../../utils/functions";
import {
  FaRegFileAlt,
  FaWpforms,
  FaFileSignature,
  FaNewspaper,
  FaRegSun,
} from "react-icons/fa";

const Sidebar = ({ sidebarClose, toggleSidebar }) => {
  //const [menuData, setMenuData] = useState();
  const [menuData, setMenuData] = useState();
  const [activeMenu, setActiveMenu] = useState(null);

  const sideBarMenu = [
    {
      Dashboard: <IoHomeSharp size={"18px"} className="shrink-0" />,
      MOUContract: <FaWpforms size={"18px"} className="shrink-0" />,
      Contract: <FaFileSignature size={"18px"} className="shrink-0" />,
      ContractClassified: <FaNewspaper size={"18px"} className="shrink-0" />,
      Reports: <FaRegFileAlt size={"18px"} className="shrink-0" />,
      Masters: <FaRegSun size={"18px"} className="shrink-0" />,
    },
  ];
  function MenuItem({ item, index }) {
    //const [toggleMasterSubLinkStatus, setMasterSubLinkStatus] = useState();
    const handleMenuClick = () => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    if (item.name === "Root") {
      // Render main menu item as individual links
      return (
        <div>
          {item.list.map((subItem) => (
            <NavLink
              to={subItem.path.replace(/^\/ecm/, "")}
              className={`bg-white flex items-center gap-3 rounded-md p-3 hover:bg-blue-600 hover:text-white transition ease-in-out mb-1 justify-start menu-holder`}
              key={subItem.id}
            >
              {sideBarMenu[0][subItem.name.replace(/\s+/g, "")]}
              {/* <BsInfoCircle size={'18px'} className="shrink-0" /> */}
              {<span className="text-md menu-title">{subItem.name}</span>}
            </NavLink>
          ))}
        </div>
      );
    }

    // Render main menu item with sub-menu
    return (
      <div
        className="w-full bg-white flex flex-col rounded-md mb-0.5"
        //onClick={() => setMasterSubLinkStatus(!toggleMasterSubLinkStatus)}
        onClick={handleMenuClick}
      >
        <div
          className={`flex items-center gap-3 rounded-md p-3 hover:bg-blue-600 hover:text-white transition ease-in-out cursor-pointer menu-holder ${activeMenu === index ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          {sideBarMenu[0][item.name.replace(/\s+/g, "")]}
          {<span className="text-md menu-title">{item.name}</span>}
          {/* {sidebarClose ? "" : <span className="text-md">{item.name}</span>} */}
        </div>
        {activeMenu === index && (
          <div className="submenu mt-1.5 p-2 bg-blue-50 rounded-md">
            {item.list.map((subItem) => (
              <NavLink
                to={subItem.path.replace(/^\/ecm/, "")}
                className="block text-gray-600 hover:text-blue-600 py-1.5"
                key={subItem.id}
              >
                <span>{subItem.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  function Menu({ menu }) {
    return (
      <div>
        {menu.map((menuItem, index) => (
          <MenuItem key={menuItem.id} item={menuItem} index={index} />
        ))}
      </div>
    );
  }

  async function getMenu() {
    try {
      const [menuList, menuGroup] = await Promise.all([
        fetchMenuList(),
        fetchMenuGroup(),
      ]);
      const mainMenu = getGroupedMenu(menuList?.success, menuGroup?.success);
      // const mainMenu = [
      //   {
      //     id: 1,
      //     name: "Root",
      //     list: [
      //       {
      //         id: 37,
      //         name: "Dashboard",
      //         path: "/dashboard",
      //         menuGroupId: 1,
      //         listOrder: 1,
      //       },
      //     ],
      //   },
      //   {
      //     id: 8,
      //     name: "MOU Contracts",
      //     list: [
      //       {
      //         id: 39,
      //         name: "Create New MOU/Aggregator",
      //         path: "/mou-new",
      //         menuGroupId: 8,
      //         listOrder: 1,
      //       },
      //       {
      //         id: 40,
      //         name: "MOU Contracts list - All",
      //         path: "/mou-contract-list",
      //         menuGroupId: 8,
      //         listOrder: 2,
      //       },
      //       {
      //         id: 41,
      //         name: "MOU contratcs list - Active",
      //         path: "/mou-contract-list-active",
      //         menuGroupId: 8,
      //         listOrder: 3,
      //       },
      //       {
      //         id: 42,
      //         name: "MOU contratcs list - Terminated",
      //         path: "/mou-contract-list-terminated",
      //         menuGroupId: 8,
      //         listOrder: 3,
      //       },
      //       {
      //         id: 43,
      //         name: "MOU contratcs list - Pending Approval",
      //         path: "/mou-contract-list-pending",
      //         menuGroupId: 8,
      //         listOrder: 3,
      //       },
      //     ],
      //   },
      //   {
      //     id: 9,
      //     name: "Contracts",
      //     list: [
      //       {
      //         id: 39,
      //         name: "Create New contract",
      //         path: "/create-contract",
      //         menuGroupId: 8,
      //         listOrder: 1,
      //       },
      //       {
      //         id: 40,
      //         name: "Contracts list - All",
      //         path: "/contract-list",
      //         menuGroupId: 8,
      //         listOrder: 2,
      //       },
      //       {
      //         id: 41,
      //         name: "Contracts list - Active",
      //         path: "/contract-list-active",
      //         menuGroupId: 8,
      //         listOrder: 3,
      //       },
      //       {
      //         id: 42,
      //         name: "Contracts list - Terminated",
      //         path: "/contract-list-terminated",
      //         menuGroupId: 8,
      //         listOrder: 3,
      //       },
      //       {
      //         id: 43,
      //         name: "Contracts list - Pending Approval",
      //         path: "/contract-list-pending",
      //         menuGroupId: 8,
      //         listOrder: 3,
      //       },
      //     ],
      //   },
      //   {
      //     id: 9,
      //     name: "Contracts Classified",
      //     list: [
      //       {
      //         id: 39,
      //         name: "Create New contract",
      //         path: "/create-contract-classified",
      //         menuGroupId: 8,
      //         listOrder: 1,
      //       },
      //       {
      //         id: 40,
      //         name: "Contracts - List",
      //         path: "/contract-classified-list",
      //         menuGroupId: 8,
      //         listOrder: 2,
      //       },
      //     ],
      //   },

      //   {
      //     id: 11,
      //     name: "Reports",
      //     list: [
      //       {
      //         id: 46,
      //         name: "Notifications",
      //         path: "/notifications",
      //         menuGroupId: 10,
      //         listOrder: 1,
      //       },
      //       {
      //         id: 47,
      //         name: "Audit Logs",
      //         path: "/auditlogs",
      //         menuGroupId: 10,
      //         listOrder: 2,
      //       },
      //     ],
      //   },

      //   {
      //     id: 11,
      //     name: "Masters",
      //     list: [
      //       {
      //         id: 46,
      //         name: "Company Master",
      //         path: "/master-management/company-master",
      //         menuGroupId: 10,
      //         listOrder: 1,
      //       },
      //       {
      //         id: 47,
      //         name: "Document Master",
      //         path: "/master-management/document-master",
      //         menuGroupId: 10,
      //         listOrder: 2,
      //       },
      //       {
      //         id: 47,
      //         name: "Contract Type Master",
      //         path: "/master-management/contract-master",
      //         menuGroupId: 10,
      //         listOrder: 2,
      //       },
      //       {
      //         id: 46,
      //         name: "Apostille Master",
      //         path: "/master-management/apostille-master",
      //         menuGroupId: 10,
      //         listOrder: 1,
      //       },
      //       {
      //         id: 46,
      //         name: "Approval Matrix - Contract",
      //         path: "/master-management/approval-matrix-contract",
      //         menuGroupId: 10,
      //         listOrder: 1,
      //       },
      //       {
      //         id: 47,
      //         name: "Approval Matrix - Classified",
      //         path: "/master-management/approval-matrix-classified",
      //         menuGroupId: 10,
      //         listOrder: 2,
      //       },
      //       {
      //         id: 48,
      //         name: "Approval Matrix - MOU",
      //         path: "/master-management/approval-matrix-mou",
      //         menuGroupId: 10,
      //         listOrder: 1,
      //       },
      //       {
      //         id: 47,
      //         name: "Escalation Matrix - Contract",
      //         path: "/master-management/escalation-matrix-contract",
      //         menuGroupId: 10,
      //         listOrder: 2,
      //       },
      //       {
      //         id: 48,
      //         name: "Escalation Matrix - MOU",
      //         path: "/master-management/escalation-matrix-mou",
      //         menuGroupId: 10,
      //         listOrder: 1,
      //       },
      //       {
      //         id: 47,
      //         name: "Escalation Matrix - Classified",
      //         path: "/master-management/escalation-matrix-classified",
      //         menuGroupId: 10,
      //         listOrder: 2,
      //       },
      //     ],
      //   },
      // ];
      setMenuData(mainMenu);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  }

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <div
      className={`left-0 fixed top-0 h-full bg-white z-10 p-2 shadow-md sidebar-wrapper scrollbar-hidden ${
        sidebarClose ? "sidebar-collapsed" : ""
      }`}
    >
      <figure className="m-0">
        {sidebarClose ? (
          <img
            src="/cms/images/logo-icon.svg"
            alt=""
            loading="lazy"
            className="h-16 mx-0 p-2"
          />
        ) : (
          <img src="/cms/images/logo.webp"  alt="" className="h-16 mx-4" />
        )}
      </figure>
      <div className="flex flex-col p-1 gap-y-2 mt-8 sidebar-menu">
        {menuData && <Menu menu={menuData} />}
      </div>
      <button type="button" className="fixed top-[20px] left-[210px] bg-white p-2 rounded close-sidemenu shadow lg:hidden" onClick={toggleSidebar}><BsXLg size={'20px'} /></button>
    </div>
  );
};

export default Sidebar;
