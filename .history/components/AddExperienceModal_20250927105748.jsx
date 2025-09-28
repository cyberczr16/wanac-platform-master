```jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AgendaStep({ step, idx, onAgendaChange, onRemoveAgendaStep, canRemove }) {
  return (
    <div className="flex gap-2 mb-2">
      <Input
        placeholder="Step Title"
        value={step.title}
        onChange={(e) => onAgendaChange(idx, "title", e.target.value)}
        required
      />
      <Input
        placeholder="Duration (e.g. 5 mins)"
        value={step.duration}
        onChange={(e) => onAgendaChange(idx, "duration", e.target.value)}
      />
      {canRemove && (
        <Button
          type="button"
          variant="destructive"
          onClick={() => onRemoveAgendaStep(idx)}
        >
          &times;
        </Button>
      )}
    </div>
  );
}

export default function AddExperienceModal({
  open,
  onClose,
  onSubmit,
  form,
  onChange,
  agenda,
  onAgendaChange,
  onAddAgendaStep,
  onRemoveAgendaStep,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleAddAgendaStepBlank = () => {
    onAddAgendaStep({ title: "", duration: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Experience Title"
            value={form.title}
            onChange={onChange}
            required
          />
          <Input
            name="subtitle"
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={onChange}
          />
          <div>
            <div className="mb-2 font-medium">Agenda Steps</div>
            {agenda.map((step, idx) => (
              <AgendaStep
                key={idx}
                step={step}
                idx={idx}
                onAgendaChange={onAgendaChange}
                onRemoveAgendaStep={onRemoveAgendaStep}
                canRemove={agenda.length > 1}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAgendaStepBlank}
            >
              + Add Step
            </Button>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```
