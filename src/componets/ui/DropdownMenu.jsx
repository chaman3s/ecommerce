import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
export function SimpleDropdownMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        style={{
          padding: "8px 12px",
          background: "#eee",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Menu
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={5}
        style={{
          background: "white",
          padding: "6px",
          border: "1px solid #ddd",
          borderRadius: "6px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <DropdownMenu.Item
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Profile
        </DropdownMenu.Item>

        <DropdownMenu.Item
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Settings
        </DropdownMenu.Item>

        <DropdownMenu.Item
          style={{
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            color: "red",
          }}
        >
          Logout
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
