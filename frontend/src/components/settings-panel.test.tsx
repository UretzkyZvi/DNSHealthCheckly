import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsPanel } from "~/components/settings-panel";
import { Settings } from "~/lib/dtos/settings.dto";

describe("SettingsPanel", () => {
  let mockUpdateSettings: jest.Mock;
  let mockResetSettings: jest.Mock;
  let mockSettings: Settings;

  const setupMockEnvironment = () => {
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
  };

  beforeAll(() => {
    window.HTMLFormElement.prototype.requestSubmit = () => {};
  });

  beforeEach(setupMockEnvironment);

  const validateElementPresence = (testId: string, expectedValue?: string) => {
    const element = screen.getByTestId(testId);
    expect(element).toBeInTheDocument();
    if (expectedValue) {
      expect(element).toHaveValue(expectedValue);
    }
  };

  test("should render Monitoring Settings title", () => {
    validateElementPresence("monitoring-settings-title");
  });

  test("should render Domain field with correct initial value", () => {
    validateElementPresence("domain-input", mockSettings.domain);
  });

  test("should call updateSettings when Update button is clicked", () => {
    fireEvent.change(screen.getByTestId("domain-input"), {
      target: { value: "newDomain.com" },
    });

    fireEvent.click(screen.getByTestId("update-button"));

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      ...mockSettings,
      domain: "newDomain.com",
    });
  });
 
  test("should call resetSettings when Reset to Default button is clicked", () => {
    // Debug: Log the current state of the DOM
    console.log(screen.debug());
  
    // Execute: click the Reset to Default button
    const resetButton = screen.getByTestId("reset-button");
    if (resetButton) {
      fireEvent.click(resetButton);
    } else {
      console.log("Reset button not found");
    }
  
    // Debug: Log if the mock was called and how many times
    console.log('Was mockResetSettings called:', mockResetSettings.mock.calls.length);
  
    // Verify: resetSettings should be called
    expect(mockResetSettings).toHaveBeenCalled();
  });
  
});
