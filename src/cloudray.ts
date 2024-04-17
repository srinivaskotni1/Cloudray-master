import * as fs from 'fs';
import moment from 'moment';

export default class CloudRay {

    public getDetails(): void {
        const data = JSON.parse(fs.readFileSync('resources/heartrate.json', 'utf-8'));
        const output = [{
            "date": this.convertDateTimeFormat(this.getLatestDate(data).toString(), "YYYYMMDDhhmmss", "YYYY-MM-DD"),
            "min": this.getMinheartrate(data),
            "max": this.getMaxheartrate(data),
            "median": this.getMedian(data),
            "latestDataTimestamp": this.convertDateTimeFormat(this.getLatestDate(data).toString(), "YYYYMMDDhhmmss", "YYYY-MM-DDThh:mm:ss")
        }];

        const outputDir = 'target';
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        fs.writeFileSync('target/output.json', JSON.stringify(output), { flag: 'a+' });
    }

    public getMinheartrate(data: any[]): number {
        return Math.min(...data.map((d) => d.beatsPerMinute));
    }

    public getMaxheartrate(data: any[]): number {
        return Math.max(...data.map((d) => d.beatsPerMinute));
    }

    public getLatestDate(data: any[]): number {
        return Math.max(...data.map((d) => d.timestamps.endTime.replace(/[^0-9]+/gm, "")));
    }

    public getMedian(data: any[]): number {
        let median: number;
        if (data.length % 2 !== 0) {
            median = data[(data.length + 1) / 2].beatsPerMinute;
        }
        else {
            const leftTerm = data[data.length / 2].beatsPerMinute;
            const rightTerm = data[(data.length / 2) + 1].beatsPerMinute;
            median = (leftTerm + rightTerm) / 2;
        }
        return median;
    }

    public convertDateTimeFormat(date: string, currentFormat: string, expectedFormat: string): string {
        return moment(date, currentFormat).format(expectedFormat);
    }

}

new CloudRay().getDetails();