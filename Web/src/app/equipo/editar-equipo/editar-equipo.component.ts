import { ActualizarEquipo } from "./../../../model/ActualizarEquipo";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, NgForm, Validators, FormBuilder } from "@angular/forms";
import { EquipoService } from "../../../servicios/equipo.service";
import { MensajeService } from "../../../servicios/mensaje.service";
import { FileUploader } from "ng2-file-upload";
import { environment } from "../../../environments/environment";
import { ActivatedRoute } from "@angular/router";

const URL = environment.apiUrl + "Equipo/Guardar";

@Component({
  selector: "app-editar-equipo",
  templateUrl: "./editar-equipo.component.html",
  styleUrls: ["./editar-equipo.component.css"]
})
export class EditarEquipoComponent implements OnInit {
  actualizaEquipo: FormGroup;
  localUrl: string;
  equipoModel: ActualizarEquipo = {} as ActualizarEquipo;
  @ViewChild("frmActualizaEquipo") frmActualizaEquipo: NgForm;

  uploader: FileUploader = new FileUploader({
    url: URL,
    authToken: "Bearer " + localStorage.getItem("token")
  });

  constructor(
    private fb: FormBuilder,
    private equipoService: EquipoService,
    public mensajeService: MensajeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.obtnerEquipo();
    this.localUrl = "./assets/img/imgFondoBandera.jpg";
    this.inicializarFormulario();
  }

  obtnerEquipo() {
    var idEquipo = this.route.snapshot.params["id"];

    this.equipoService.obtenerEquipo(idEquipo).subscribe(
      data => {
        this.equipoModel = data;
      },
      error => {
        this.mensajeService.error("Ocurrio un error interno ");
      },
      () => {
        this.inicializarFormulario();
        this.localUrl = this.equipoModel.banderaUrl;
      }
    );
  }

  inicializarFormulario() {
    this.actualizaEquipo = this.fb.group({
      Nombre: [
        this.equipoModel.nombre,
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(150)
        ]
      ],
      File: ["", Validators.required],
      partidosJugados: [this.equipoModel.partidosJugados, Validators.required],
      partidosGanados: [this.equipoModel.partidosGanados, Validators.required],
      partidosEmpatados: [
        this.equipoModel.partidosEmpatados,
        Validators.required
      ],
      partidosPerdidos: [
        this.equipoModel.partidosPerdidos,
        Validators.required
      ],
      golesAFavor: [this.equipoModel.golesAFavor, Validators.required],
      golesEnContra: [this.equipoModel.golesEnContra, Validators.required],
      diferenciaGoles: [this.equipoModel.diferenciaGoles, Validators.required],
      puntos: [this.equipoModel.puntos, Validators.required]
    });
  }

  ActualizarEquipo() {
    if (this.actualizaEquipo.valid) {
      this.equipoModel = Object.assign({}, this.actualizaEquipo.value);

      this.uploader.options.additionalParameter = this.equipoModel;

      this.uploader.uploadAll();

      this.mensajeService.success("Registrado Correctamente ");

      this.localUrl = "./assets/img/imgFondoBandera.jpg";
      this.frmActualizaEquipo.reset();
    }
  }

  SeleccionarFoto(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.localUrl = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
}
