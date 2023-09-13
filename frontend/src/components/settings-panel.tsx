import {
  Card,
  Title,
  Subtitle,
  Text,
  Bold,
  Italic,
  TextInput,
  NumberInput,
  Button,
} from "@tremor/react";
import { Settings } from "~/lib/dtos/settings.dto";
import RegionSelection from "~/components/regions-selection";
import CheckIntervalSelection from "~/components/check-interval-selection";
import clsx from "clsx";
import { useState } from "react";

interface SettingsPanelProps {
  settings: Settings;
  updateSettings: (updatedSettings: Settings) => void;
  resetSettings: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  updateSettings,
  resetSettings,
}) => {
  const [formData, setFormData] = useState<Partial<Settings>>({
    thresholds: {},
  });

  const [ttlEnabled, setTtlEnabled] = useState<boolean>(
    settings?.metrics?.includes("ttl") ?? false,
  );

  const handleInputChange = (name: string, value: string | object | number) => {
    if (name === "thresholds") {
      debugger;
      if (typeof value === "object" && value !== null) {
        setFormData({
          ...formData,
          thresholds: {
            ...formData.thresholds,
            ...value,
          },
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUpdateClick = () => {
    const thresholds = { ...settings.thresholds, ...formData.thresholds };
    const updatedMetrics = settings?.metrics ? [...settings.metrics] : [];

    if (ttlEnabled && !updatedMetrics.includes("ttl")) {
      updatedMetrics.push("ttl");
    } else if (!ttlEnabled) {
      const index = updatedMetrics.indexOf("ttl");
      if (index > -1) {
        updatedMetrics.splice(index, 1);
      }
    }
    const updatedSettings = {
      ...settings,
      ...formData,
      thresholds,
      metrics: updatedMetrics,
    }; // Combine old and new settings
    updateSettings(updatedSettings);
  };

  const handleResetClick = () => {
    resetSettings();
  };

  return (
    <Card>
      <form>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <Title>Monitoring Settings</Title>
            <Subtitle>Configure your DNS monitoring settings.</Subtitle>
          </div>

          {settings && (
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              {/* Domain Input */}
              <div className="sm:col-span-4">
                <Text id="domain">
                  <Bold>Domain</Bold>
                </Text>
                <TextInput
                  type="text"
                  name="domain"
                  id="domain"
                  data-testid="domain-input"
                  value={formData.domain || settings?.domain}
                  onChange={(e) =>
                    handleInputChange(e.target.name, e.target.value)
                  }
                ></TextInput>
              </div>

              {/* Region Input */}
              <div className="sm:col-span-4">
                <Text>
                  <Bold>Region</Bold>
                </Text>
                <RegionSelection
                  currentRegion={formData.region || settings?.region}
                  onChange={(region) => {
                    handleInputChange("region", region);
                  }}
                />
              </div>
              <div className="sm:col-span-4">
                <Text>
                  <Bold>Check Interval</Bold>
                </Text>
                <CheckIntervalSelection
                  currentInterval={
                    formData.checkInterval || settings?.checkInterval
                  }
                  onChange={(interval) => {
                    handleInputChange("checkInterval", interval);
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
          <div>
            <Title>Health Check Settings</Title>
            <Subtitle>Configure your DNS health check settings.</Subtitle>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 pt-4 sm:grid-cols-6 md:col-span-2">
            <div className="sm:col-span-4">
              <Text>
                <Bold>Response Time Threshold</Bold>
              </Text>
              <NumberInput
                enableStepper={true}
                name="response-time-threshold"
                id="response-time-threshold"
                value={
                  formData.thresholds?.responseTime ||
                  settings?.thresholds.responseTime
                }
                onChange={(e) => {
                  handleInputChange("thresholds", {
                    responseTime: e.target.value,
                  });
                }}
              />
            </div>
            <div className="sm:col-span-4">
              <Text>
                <Bold>Time to Live Threshold</Bold>
              </Text>
              <Text>
                <Italic>
                  Check the box to monitor DNS health via TTL values.
                </Italic>
              </Text>
              <div className="relative flex items-center space-x-4">
                <div className="flex h-6 items-center">
                  <input
                    id="ttl_enabled"
                    aria-describedby="ttl_enabled-description"
                    name="ttl_enabled"
                    type="checkbox"
                    className={clsx(
                      "h-6 w-6 rounded border-gray-300 text-tremor-brand-subtle focus:ring-tremor-brand-subtle",
                      "hover:cursor-pointer   hover:border-tremor-brand-subtle",
                    )}
                    checked={ttlEnabled}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.checked) {
                        setTtlEnabled(true);
                      } else {
                        setTtlEnabled(false);
                      }
                    }}
                  />
                </div>
                <NumberInput
                  enableStepper={true}
                  name="time-to-live-threshold"
                  id="time-to-live-threshold"
                  value={
                    settings?.thresholds.ttl || formData.thresholds?.ttl || 0
                  }
                  onChange={(e) => {
                    if (ttlEnabled) {
                      handleInputChange("thresholds", { ttl: e.target.value });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button variant="secondary" onClick={() => handleResetClick()}>
            Reset to Default
          </Button>
          <Button variant="primary" data-testid="update-button" onClick={() => handleUpdateClick()}>
            Update
          </Button>
        </div>
      </form>
    </Card>
  );
};
