import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface FormData {
	title: string;
	description: string;
	anonymous: boolean;
	urgency: string;
}

interface DetailsStepProps {
	formData: FormData;
	onChange: (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>,
	) => void;
	onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DetailsStep({
	formData,
	onChange,
	onCheckboxChange,
}: DetailsStepProps) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="title">Judul Laporan</Label>
				<Input
					id="title"
					name="title"
					placeholder="Judul singkat yang menggambarkan masalahnya"
					value={formData.title}
					onChange={onChange}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Deskripsi</Label>
				<Textarea
					id="description"
					name="description"
					placeholder="Ceritakan dengan detail masalah yang kamu temukan"
					value={formData.description}
					onChange={onChange}
					required
					rows={5}
				/>
				<p className="text-xs text-muted-foreground">
					Jangan lupa sertakan informasi penting yang bisa membantu petugas
					mengatasi masalahnya ya!
				</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="urgency">Tingkat Urgensi</Label>
				<Select
					name="urgency"
					value={formData.urgency}
					onValueChange={(value) => {
						onChange({
							target: { name: "urgency", value },
						} as React.ChangeEvent<HTMLSelectElement>);
					}}
				>
					<SelectTrigger>
						<SelectValue placeholder="Pilih tingkat urgensi" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="low">
							Rendah - Bisa ditangani kapan saja
						</SelectItem>
						<SelectItem value="medium">
							Sedang - Sebaiknya segera diperbaiki
						</SelectItem>
						<SelectItem value="high">
							Tinggi - Perlu penanganan segera
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center space-x-2 pt-2">
				<Checkbox
					id="anonymous"
					name="anonymous"
					checked={formData.anonymous}
					onCheckedChange={(checked) => {
						onCheckboxChange({
							target: { name: "anonymous", checked: !!checked },
						} as React.ChangeEvent<HTMLInputElement>);
					}}
				/>
				<Label htmlFor="anonymous" className="text-sm font-normal">
					Kirim laporan ini tanpa menyertakan identitas saya
				</Label>
			</div>
		</div>
	);
}
