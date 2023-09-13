import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsPanel } from "~/components/settings-panel";
import { Settings } from "~/lib/dtos/settings.dto";

describe("SettingsPanel", () => {
  let mockUpdateSettings: jest.Mock;
  let mockResetSettings: jest.Mock;
  let mockSettings: Settings;

  beforeEach(() => {
    mockUpdateSettings = jest.fn();
    mockResetSettings = jest.fn();

    mockSettings = {
      domain: "www.google.com",
      region: "Global",
      metrics: ["responseTime", "statusCode", "ttl"],
      thresholds: {
        responseTime: 200,
        statusCode: "NOERROR",
        ttl: 300,
      },
      checkInterval: 10,
    };

    render(
      <SettingsPanel
        settings={mockSettings}
        updateSettings={mockUpdateSettings}
        resetSettings={mockResetSettings}
      />,
    );
  });

  test("renders Monitoring Settings title", () => {
    const title = screen.getByText("Monitoring Settings");
    expect(title).toBeInTheDocument();
  });

  // ... other unit tests like above for different parts

  test("calls updateSettings when Update button is clicked", () => {
    // setup: fill the form fields
    fireEvent.change(screen.getByLabelText(/Domain/), {
      target: { value: "newDomain.com" },
    });

    // execute: click the Update button
    fireEvent.click(screen.getByText("Update"));

    // verify: updateSettings should be called
    expect(mockUpdateSettings)
      .toHaveBeenCalledWith
      // expected updatedSettings object
      ();
  });

  test("calls resetSettings when Reset to Default button is clicked", () => {
    // execute: click the Reset to Default button
    fireEvent.click(screen.getByText("Reset to Default"));

    // verify: resetSettings should be called
    expect(mockResetSettings).toHaveBeenCalled();
  });
});
